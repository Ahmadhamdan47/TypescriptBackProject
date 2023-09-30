import { EXCHANGE } from "../resources/constants";
import { getBindingKeyInfoFromId } from "./notifBindingKey.server";
import { getAuthorizationStringFromSystemId } from "./system.server";
import config from "../resources/config";
import { prefs, customAxios as axios } from "../../webServer";
import { v4 as uuidv4 } from "uuid";
import nodeSchedule from "node-schedule";
import {
  EnumScheduledJobsNames,
  sendScheduledMessage,
} from "../jobs/initScheduling.server.job";
import { NewScheduledJob } from "../../database/interfaces/scheduledJob.database";
import { logger } from "../../../logger";

export interface NotifMessageServerInterface {
  title: string;
  body: string;
  messageTtl: number; // seconds
  messageDelay: number; // seconds
  priority: string;
  sender: string;
  enclosed_file: string;
  notifBindingKeysIds: number[];
}

export interface NotifMessageHistoryInterface
  extends NotifMessageServerInterface {
  messageUuid: string;
  status: string;
  systemId: number;
}

export enum MessageStatus {
  Sent = "Sent",
  Deleted = "Deleted",
  Delayed = "Delayed",
  Canceled = "Canceled",
}

export interface NotifMessagePropertiesInterface {
  delivery_mode: number;
  content_type: string;
  message_id: string;
  headers: NotifMessageHeadersInterface;
}

/**
 * Headers used at reception. Dates are epoch timestamps in seconds and
 * headers cannot be renamed because at reception their name is reused
 */
export interface NotifMessageHeadersInterface {
  ack_flag: number;
  ack_date: number;
  sending_date: number;
  exp_date: number;
  sender: string;
  recipient: string;
  priority: string;
  enclosed_file: string;
  title: string;
}

export async function sendNotifMessage(message: NotifMessageServerInterface) {
  logger.info("sendNotifMessage");
  // create "routed" list
  const routed: boolean[] = [];

  const sending_date = (new Date().getTime() / 1000) >> 0;
  // generate a random message_id as uuid
  const messageUuid = uuidv4();

  let properties: NotifMessagePropertiesInterface = {
    delivery_mode: 2,
    content_type: "text/plain",
    message_id: messageUuid,
    headers: {
      ack_flag: 0,
      ack_date: 0,
      sending_date: sending_date,
      exp_date: message.messageTtl,
      sender: message.sender,
      recipient: "",
      priority: message.priority,
      enclosed_file: message.enclosed_file,
      title: message.title,
    },
  };

  let systemIds = new Set<number>();

  for await (const bindingKeyId of message.notifBindingKeysIds) {
    const bindingKeyInfo = await getBindingKeyInfoFromId(bindingKeyId);

    // check if message is sent to multiple systems
    systemIds.add(bindingKeyInfo.systemId);
    if (systemIds.size > 1) {
      throw new Error("Message can't be sent to multiple systems");
    }
    const url_api = bindingKeyInfo.url_api;
    properties.headers.recipient = bindingKeyInfo.name;

    // send message to binding key and append to routed list
    routed.push(
      (
        await axios.post(
          url_api + "/exchanges/%2F/" + EXCHANGE + "/publish",
          {
            properties: properties,
            routing_key: bindingKeyInfo.name,
            payload: message.body,
            payload_encoding: "string",
          },
          {
            headers: {
              Authorization: await getAuthorizationStringFromSystemId(
                bindingKeyInfo.systemId
              ),
            },
          }
        )
      ).data.routed
    );
  }

  // historize message
  await insertNotifHistorizedMessage(message, messageUuid, [...systemIds][0]);
  return routed;
}

export async function delayNotifMessage(message: NotifMessageServerInterface) {
  logger.info("delayNotifMessage");
  // verify that message is sent to only one system and thus can be sent later
  let systemIds = new Set<number>();
  for await (const bindingKeyId of message.notifBindingKeysIds) {
    const bindingKeyInfo = await getBindingKeyInfoFromId(bindingKeyId);
    // check if message is sent to multiple systems
    systemIds.add(bindingKeyInfo.systemId);
    if (systemIds.size > 1) {
      throw new Error("Message can't be sent to multiple systems");
    }
  }

  // historize message
  const histId = await insertNotifHistorizedMessage(
    message,
    "0",
    [...systemIds][0],
    MessageStatus.Delayed
  );

  const scheduledDate = new Date(message.messageDelay * 1000 + Date.now());
  // Add message to scheduled jobs db
  const newJob: NewScheduledJob = {
    name: "Send delayed message",
    task: EnumScheduledJobsNames.sendScheduledMessage,
    date: scheduledDate,
  };
  const jobId: number = (
    await axios.post(config.xtvision.databaseUrl + "/scheduledJobs", newJob, {
      headers: {
        Authorization: prefs.databaseAuth,
      },
    })
  ).data;

  // Schedule message
  nodeSchedule.scheduleJob(jobId.toString(), scheduledDate, async () => {
    await sendScheduledMessage(jobId, histId);
  });
  return jobId;
}

export async function insertNotifHistorizedMessage(
  message: NotifMessageServerInterface,
  messageUuid: string,
  systemId: number,
  status: MessageStatus = MessageStatus.Sent
) {
  logger.info("insertNotifHistorizedMessage");
  return (
    await axios.post(
      config.xtvision.databaseUrl + "/notifHistorizedMessages",
      { ...message, messageUuid, status, systemId },
      {
        headers: {
          Authorization: prefs.databaseAuth,
        },
      }
    )
  ).data;
}

export async function cancelDelayedNotifMessage(
  jobId: string,
  messageId: string
) {
  logger.info("cancelDelayedNotifMessage");
  nodeSchedule.cancelJob(jobId);

  // delete message from scheduled jobs db
  await axios.delete(config.xtvision.databaseUrl + "/scheduledJobs/" + jobId, {
    headers: {
      Authorization: prefs.databaseAuth,
    },
  });

  // update message status in historized messages db
  await axios.put(
    config.xtvision.databaseUrl + "/notifHistorizedMessages/" + messageId,
    {
      status: MessageStatus.Canceled,
    },
    {
      headers: {
        Authorization: prefs.databaseAuth,
      },
    }
  );
}
