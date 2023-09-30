import { Server } from "http";
import { EquipmentNotifBindingKeyDatabaseInterface } from "../../database/interfaces/equipmentNotifBindingKey.database";
import {
  NewNotifBindingKey,
  NotifBindingKeyDatabaseInterface,
  SendingMode,
} from "../../database/interfaces/notifBindingKey.database";
import config from "../resources/config";
import { prefs, customAxios as axios } from "../../webServer";
import {
  bindEquipmentsBindingKey,
  createNotifBindingKey,
  deleteRabbitMQBinding,
  deleteRabbitMQQueue,
  getBindingKeyInfoFromId,
} from "../interfaces/notifBindingKey.server";
import { logger } from "../../../logger";

export class NotifBindingKeyServerService {
  constructor(protected server: Server) {}

  /**
   * get all notifs binding keys in db xtvision
   */
  async getNotifBindingKeys(): Promise<NotifBindingKeyDatabaseInterface[]> {
    logger.info("getNotifBindingKeys");
    return (
      await axios.get(config.xtvision.databaseUrl + "/notifBindingKeys", {
        headers: {
          Authorization: prefs.databaseAuth,
        },
      })
    ).data;
  }

  /**
   * get a notif binding key by id in db xtvision
   */
  async getNotifBindingKeyById(
    id: string
  ): Promise<NotifBindingKeyDatabaseInterface> {
    logger.info("getNotifBindingKeyById");
    return (
      await axios.get(config.xtvision.databaseUrl + "/notifBindingKeys/" + id, {
        headers: {
          Authorization: prefs.databaseAuth,
        },
      })
    ).data;
  }

  /**
   * Insert or update new notif binding key in db XtVision
   */
  async createNotifBindingKey(
    newNotifBindingKey: NewNotifBindingKey,
    equipmentIds?: number[]
  ): Promise<NotifBindingKeyDatabaseInterface> {
    logger.info("createNotifBindingKey");
    return await createNotifBindingKey(newNotifBindingKey, equipmentIds);
  }

  /**
   * creates the binding between a binding key and the needed equipments
   * @param equipmentIds
   * @param notifBindingKeyId
   */
  async bindEquipmentsBindingKey(
    equipmentIds: number[],
    notifBindingKeyId: number
  ) {
    logger.info("bindEquipmentsBindingKey");
    await bindEquipmentsBindingKey(equipmentIds, notifBindingKeyId);
  }

  /**
   * Gets the binding key in database, creates a "copy" taking
   *  into account the given params, creates the bindings in RabbitMQ
   * and THEN deletes the former key in database
   * @param params
   * @param id
   */
  async modifyNotifBindingKey(id: string, params: any) {
    logger.info("modifyNotifBindingKey");
    const currentBindingKey = await this.getNotifBindingKeyById(id);
    const currentEquipments = (
      await axios.get(
        config.xtvision.databaseUrl +
          "/equipmentsNotifBindingKeys?notifBindingKeyId=" +
          id,
        {
          headers: {
            Authorization: prefs.databaseAuth,
          },
        }
      )
    ).data.map((elem: any) => elem.EquipmentId);

    // create new binding key taking the old one as a base and overriding the given params
    const newBindingKey: NewNotifBindingKey = {
      name: params.name ? params.name : currentBindingKey.name,
      defaultMessageTtl: params.messageTtl
        ? params.messageTtl
        : currentBindingKey.defaultMessageTtl,
      systemId: params.systemId ? params.systemId : currentBindingKey.systemId,
      sendingMode: params.sendingMode
        ? params.sendingMode
        : currentBindingKey.sendingMode,
    };

    await createNotifBindingKey(
      newBindingKey,
      params.equipmentIds ? params.equipmentIds : currentEquipments
    );
    await this.deleteNotifBindingKey(id);
  }

  /**
   * Delete a notif binding key in db XtVision
   */
  async deleteNotifBindingKey(notifBindingKeyId: string) {
    logger.info("deleteNotifBindingKey");
    const bindingKeyInfo = await getBindingKeyInfoFromId(
      Number(notifBindingKeyId)
    );
    // get binding key's name
    const name = bindingKeyInfo.name;
    // Get url api
    const url_api = bindingKeyInfo.url_api;
    const systemId = bindingKeyInfo.systemId;

    // get equipment ids (queuenames) list to delete from RabbitMQ
    const bindings: EquipmentNotifBindingKeyDatabaseInterface[] = (
      await axios.get(
        config.xtvision.databaseUrl +
          "/equipmentsNotifBindingKeys?notifBindingKeyId=" +
          notifBindingKeyId,
        {
          headers: {
            Authorization: prefs.databaseAuth,
          },
        }
      )
    ).data;
    const queueNames = bindings.map(binding => binding.EquipmentId.toString());
    // delete RabbitMQ bindings

    if (bindingKeyInfo.sendingMode === SendingMode.Common) {
      await deleteRabbitMQQueue(systemId, url_api, name);
    } else {
      await Promise.all(
        queueNames.map(
          async queueName =>
            await deleteRabbitMQBinding(systemId, url_api, queueName, name)
        )
      );
    }

    return await axios.delete(
      config.xtvision.databaseUrl + "/notifBindingKeys/" + notifBindingKeyId,
      {
        headers: {
          Authorization: prefs.databaseAuth,
        },
      }
    );
  }
}
