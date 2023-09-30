import { Server } from "http";
import { NotifPredefinedMessageDatabaseInterface } from "../../database/interfaces/notifPredefinedMessage.database";
import { prefs, customAxios as axios } from "../../webServer";
import {
  MessageStatus,
  NotifMessageServerInterface,
  insertNotifHistorizedMessage,
  delayNotifMessage,
  sendNotifMessage,
  cancelDelayedNotifMessage,
} from "../interfaces/notifMessage.server";
import { NewNotifPredefinedMessageNotifBindingKey } from "../../database/interfaces/notifPredefinedMessageNotifBindingKey.database";
import config from "../resources/config";
import { NotifHistorizedMessageDatabaseInterface } from "../../database/interfaces/notifHistorizedMessage.database";
import amqplib from "amqplib";
import { aesDecryptStringFromHex } from "../resources/aesUtilities.server";
import { logger } from "../../../logger";

export class NotifMessageServerService {
  constructor(protected server: Server) {}

  /* ============================================================================================
   *
   * REQUESTS FOR PREDEFINED NOTIF MESSAGES
   *
   * ============================================================================================ */

  /**
   * Get all notifPredefinedMessages
   */
  async getNotifPredefinedMessages(): Promise<
    NotifPredefinedMessageDatabaseInterface[]
  > {
    logger.info("getNotifPredefinedMessages");
    return (
      await axios.get(
        config.xtvision.databaseUrl + "/notifPredefinedMessages",
        {
          headers: {
            Authorization: prefs.databaseAuth,
          },
        }
      )
    ).data;
  }

  /**
   * Insert a notifPredefinedMessage in db XTVision
   * @param message NotifMessageServerInterface
   * @returns
   */
  async insertNotifPredefinedMessage(
    message: NotifMessageServerInterface
  ): Promise<NotifPredefinedMessageDatabaseInterface> {
    logger.info("insertNotifPredefinedMessage");
    const notifMessage = (
      await axios.post(
        config.xtvision.databaseUrl + "/notifPredefinedMessages",
        message,
        {
          headers: {
            Authorization: prefs.databaseAuth,
          },
        }
      )
    ).data;

    // Create notifPredefinedMessage - notifBindingKey bindings
    const notifMessageNotifBindingKeys: NewNotifPredefinedMessageNotifBindingKey[] =
      message.notifBindingKeysIds.map(notifBindingKeyId => ({
        NotifPredefinedMessageId: notifMessage.id,
        NotifBindingKeyId: notifBindingKeyId,
      }));
    if (notifMessageNotifBindingKeys.length > 0) {
      await axios.post(
        config.xtvision.databaseUrl + "/notifPredefinedMessageNotifBindingKeys",
        notifMessageNotifBindingKeys,
        {
          headers: {
            Authorization: prefs.databaseAuth,
          },
        }
      );
    }
    return notifMessage;
  }

  /**
   * Update a notif predefined message in db XTVision
   */
  async updateNotifPredefinedMessage(id: string, newNotifMessage: any) {
    logger.info("updateNotifPredefinedMessage");
    await axios.put(
      config.xtvision.databaseUrl + "/notifPredefinedMessages/" + id,
      newNotifMessage,
      {
        headers: {
          Authorization: prefs.databaseAuth,
        },
      }
    );
  }

  /**
   * Delete a notif predefined message in db XTVision
   */
  async deleteNotifPredefinedMessage(id: string) {
    logger.info("deleteNotifPredefinedMessage");
    await axios.delete(
      config.xtvision.databaseUrl + "/notifPredefinedMessages/" + id,
      {
        headers: {
          Authorization: prefs.databaseAuth,
        },
      }
    );
  }

  /* ============================================================================================
   *
   * REQUESTS FOR HISTORIZED NOTIF MESSAGES
   *
   * ============================================================================================ */

  /**
   * Get all notifHistorizedMessages
   */
  async getNotifHistorizedMessages(): Promise<
    NotifHistorizedMessageDatabaseInterface[]
  > {
    logger.info("getNotifHistorizedMessages");
    return (
      await axios.get(
        config.xtvision.databaseUrl + "/notifHistorizedMessages",
        {
          headers: {
            Authorization: prefs.databaseAuth,
          },
        }
      )
    ).data;
  }

  /**
   * Get one notifHistorizedMessage
   */
  async getNotifHistorizedMessageById(
    id: string
  ): Promise<NotifHistorizedMessageDatabaseInterface> {
    logger.info("getNotifHistorizedMessageById");
    return (
      await axios.get(
        config.xtvision.databaseUrl + "/notifHistorizedMessages/" + id,
        {
          headers: {
            Authorization: prefs.databaseAuth,
          },
        }
      )
    ).data;
  }

  /**
   * Insert a notifHistorizedMessage in db XTVision
   * @param message NotifMessageServerInterface
   * @returns
   */
  async insertNotifHistorizedMessage(
    message: NotifMessageServerInterface,
    messageUuid: string,
    systemId: number
  ) {
    logger.info("insertNotifHistorizedMessage");
    await insertNotifHistorizedMessage(message, messageUuid, systemId);
  }

  /**
   * Update a notif historized message in db XTVision
   */
  async updateNotifHistorizedMessage(id: string, newNotifMessage: any) {
    logger.info("updateNotifHistorizedMessage");
    await axios.put(
      config.xtvision.databaseUrl + "/notifHistorizedMessages/" + id,
      newNotifMessage,
      {
        headers: {
          Authorization: prefs.databaseAuth,
        },
      }
    );
  }

  /* ============================================================================================
   *
   * REQUESTS FOR SENT MESSAGES
   *
   * ============================================================================================ */

  /**
   * Send a notif message to N Binding Keys
   */
  async sendNotifMessage(message: NotifMessageServerInterface) {
    logger.info("sendNotifMessage");
    return await sendNotifMessage(message);
  }

  /**
   * Iterates over queueNames and delete the message in each queue
   * @param queueNames
   */
  async deleteNotifMessageFromNotifServer(id: string) {
    logger.info("deleteNotifMessageFromNotifServer");
    const message = await this.getNotifHistorizedMessageById(id);
    const notifBindingKeysIds = message.notifBindingKeysIds.split(";");
    // reminder: queueNames are equipmentIds so
    // we need to get the equipmentIds from the notifBindingKeysIds
    const queueNames = (
      await axios.post(
        config.xtvision.databaseUrl +
          "/equipmentsNotifBindingKeys/equipmentsIds",
        notifBindingKeysIds,
        {
          headers: {
            Authorization: prefs.databaseAuth,
          },
        }
      )
    ).data;

    for (const queue of queueNames) {
      await this.deleteNotifMessageFromQueue(message.systemId, queue, id);
    }
  }

  async deleteNotifMessageFromQueue(
    systemId: number,
    queueName: string,
    messageId: string
  ) {
    logger.info("deleteNotifMessageFromQueue");
    const system = (
      await axios.get(
        config.xtvision.databaseUrl + "/notifServers/" + systemId,
        {
          headers: {
            Authorization: prefs.databaseAuth,
          },
        }
      )
    ).data;
    // get url_api without http:// and without /api
    const truncated_url_api = system.url_api.split("/")[2];

    const connection = await amqplib.connect("amqp://" + truncated_url_api, {
      credentials: amqplib.credentials.plain(
        system.username,
        await aesDecryptStringFromHex(system.password)
      ),
    });

    const channel = await connection.createChannel();

    let messageFound = false;
    // consume messages and unack them until the message with the right messageId is found and acked
    while (!messageFound) {
      await channel.consume(queueName, message => {
        if (message !== null) {
          if (message.properties.messageId !== messageId) {
            channel.nack(message, false, true);
          } else {
            messageFound = true;
            channel.ack(message);
          }
        }
      });
    }
    await channel.close();
    await connection.close();

    await this.updateNotifHistorizedMessage(messageId, {
      status: MessageStatus.Deleted,
    });
  }

  /* ============================================================================================
   *
   * REQUESTS FOR DELAYED MESSAGES
   *
   * ============================================================================================ */

  /**
   * Send a delayed notif message to N Binding Keys
   * @param message
   */
  async delayNotifMessage(message: NotifMessageServerInterface) {
    logger.info("delayNotifMessage");
    return await delayNotifMessage(message);
  }

  /**
   * Cancel a delayed notif message
   * @param jobId
   * @returns
   */
  async cancelDelayedNotifMessage(jobId: string, messageId: string) {
    logger.info("cancelDelayedNotifMessage");
    return await cancelDelayedNotifMessage(jobId, messageId);
  }
}
/* 
            @@.   @&                        
          .&        &%&    &&               
          @         &        &              
          &         &          &             
          @        &          &              
          &    %#,&         /               
      &&                  &                
      &                  &                  
    &&   &       @&       &                 
  @& ... &   &   /@....   %@                
  &   .             ..     &                
  &#                       &                
    &,                    @&                
    &                       &               
  *@                        &              
  &                          & &@          
  &                             %%         
  &   @/   &    / /             &          
  &&&&&&@ &&&  &@ &&    @&&&&&@    
*/
