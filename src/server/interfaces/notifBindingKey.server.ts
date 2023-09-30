import { NewEquipmentNotifBindingKey } from "../../database/interfaces/equipmentNotifBindingKey.database";
import {
  NewNotifBindingKey,
  NotifBindingKeyDatabaseInterface,
  SendingMode,
} from "../../database/interfaces/notifBindingKey.database";
import config from "../resources/config";
import { COMMON_PREFIX, EXCHANGE } from "../resources/constants";
import { prefs, customAxios as axios } from "../../webServer";
import {
  getAuthorizationStringFromSystemId,
  getSystemFromDb,
} from "./system.server";

export interface NotifServerBinding {
  sender: string;
  vhost: string;
  destination: string;
  destination_type: string;
  routing_key: string;
  arguments: {};
  properties_key: string;
}

export interface NotifBindingKeyServerInterface {
  name: string;
  systemId: number;
  equipmentIds?: number[];
  defaultMessageTtl: number;
  sendingMode: SendingMode;
}

/**
 * Used to return a binding key's info from XtVision DB
 */
export interface NotifBindingKeyInfoServerInterface {
  name: string;
  systemId: number;
  url_api: string;
  defaultMessageTtl: number;
  /** this is used when creating a "group" to tell if all unique equipments queues
   *  shall be binded to a key or if all equipments should listen to a common queue
   */
  sendingMode: SendingMode;
}

/**
 * Insert or update new notif binding key in db XtVision
 */
export async function createNotifBindingKey(
  newNotifBindingKey: NewNotifBindingKey,
  equipmentIds?: number[]
): Promise<NotifBindingKeyDatabaseInterface> {
  // Create notif binding key
  const notifBindingKey = (
    await axios.post(
      config.xtvision.databaseUrl + "/notifBindingKeys",
      newNotifBindingKey,
      {
        headers: {
          Authorization: prefs.databaseAuth,
        },
      }
    )
  ).data;

  if (equipmentIds) {
    await bindEquipmentsBindingKey(equipmentIds, notifBindingKey.id);
  }

  return notifBindingKey;
}

/**
 * creates the binding between a binding key and the needed equipments
 * @param equipmentIds
 * @param notifBindingKeyId
 */
export async function bindEquipmentsBindingKey(
  equipmentIds: number[],
  notifBindingKeyId: number
) {
  // Create equipments - notif binding key bindings
  const equipmentNotifBindingKeys: NewEquipmentNotifBindingKey[] =
    equipmentIds.map(equipmentId => ({
      EquipmentId: equipmentId,
      NotifBindingKeyId: notifBindingKeyId,
    }));

  await axios.post(
    config.xtvision.databaseUrl + "/equipmentsNotifBindingKeys",
    equipmentNotifBindingKeys,
    {
      headers: {
        Authorization: prefs.databaseAuth,
      },
    }
  );
  await setupNotifServer(notifBindingKeyId, equipmentIds);
}

/**
 * Create Exchanges, Queues and bindings
 * @param notifBindingKeyId
 * @param equipmentIds Queue names in notif server.
 */
export async function setupNotifServer(
  notifBindingKeyId: number,
  equipmentIds: number[]
) {
  const bindingKeyInfo = await getBindingKeyInfoFromId(notifBindingKeyId);
  // get binding key's name
  const name = bindingKeyInfo.name;
  // Get url api
  const url_api = bindingKeyInfo.url_api;
  // Get sending mode
  const sendingMode = bindingKeyInfo.sendingMode;

  if (sendingMode === SendingMode.Common) {
    // create queue "common_..."
    const commonName = name.includes(COMMON_PREFIX)
      ? name
      : COMMON_PREFIX + name;
    await createQueueAndBinding(
      bindingKeyInfo.systemId,
      commonName,
      url_api,
      commonName
    );
    // TODO Send config to CS "make equipmentIds listen to [common_...]"
  } else {
    // Create Queues and bindings
    await Promise.all(
      equipmentIds.map(async equipmentId => {
        await createQueueAndBinding(
          bindingKeyInfo.systemId,
          equipmentId.toString(),
          url_api,
          name
        );
      })
    );
    // TODO Send config to CS "make equipmentIds listen to [equipmentId]"
  }
}

/**
 *
 * @param queueName
 * @param url_api
 * @param key
 */
export async function createQueueAndBinding(
  systemId: number,
  queueName: string,
  url_api: string,
  key: string
) {
  await axios.put(
    url_api + "/queues/%2F/" + queueName,
    { auto_delete: false, durable: true },
    {
      headers: {
        Authorization: await getAuthorizationStringFromSystemId(systemId),
      },
    }
  );
  await axios.post(
    url_api + "/bindings/%2F/e/" + EXCHANGE + "/q/" + queueName,
    {
      routing_key: key,
    },
    {
      headers: {
        Authorization: await getAuthorizationStringFromSystemId(systemId),
      },
    }
  );
}

/**
 * Gets Binding Key info from ID
 * @param notifBindingKeyId id of the notifBindingKey
 * @returns Binding Key info
 */
export async function getBindingKeyInfoFromId(
  notifBindingKeyId: number
): Promise<NotifBindingKeyInfoServerInterface> {
  //get binding key
  const bindingKey = (
    await axios.get(
      config.xtvision.databaseUrl + "/notifBindingKeys/" + notifBindingKeyId,
      { headers: { Authorization: prefs.databaseAuth } }
    )
  ).data;
  // get binding key's system id
  const systemId = bindingKey.systemId;
  // get binding key's name
  const name = bindingKey.name;
  // get binding key's message ttl
  const defaultMessageTtl = bindingKey.messageTtl;
  // get binding key's sending mode
  const sendingMode = bindingKey.sendingMode;

  // Get url api
  const url_api = (await getSystemFromDb(systemId)).url_connexion_api;

  return { systemId, name, url_api, defaultMessageTtl, sendingMode };
}

/**
 * delete -in a RabbitMQ server- a queue binding with a key
 * @param url_api
 * @param queueName
 * @param key
 */
export async function deleteRabbitMQBinding(
  systemId: number,
  url_api: string,
  queueName: string,
  key: string
) {
  await axios.delete(
    url_api + "/bindings/%2F/e/" + EXCHANGE + "/q/" + queueName + "/" + key,
    {
      headers: {
        Authorization: await getAuthorizationStringFromSystemId(systemId),
      },
    }
  );
}

/**
 * delete a queue in a RabbitMQ server
 * @param url_api
 * @param queueName
 */
export async function deleteRabbitMQQueue(
  systemId: number,
  url_api: string,
  queueName: string
) {
  await axios.delete(url_api + "/queues/%2F/" + queueName, {
    headers: {
      Authorization: await getAuthorizationStringFromSystemId(systemId),
    },
  });
  // TODO: send CS the order to remove "name" from the queues equipments listen to
}
