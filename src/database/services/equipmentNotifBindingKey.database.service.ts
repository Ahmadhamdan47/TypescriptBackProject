import { Server } from "http";
import { logger } from "../../../logger";
import {
  NewEquipmentNotifBindingKey,
  EquipmentNotifBindingKeyDatabaseInterface,
} from "../interfaces/equipmentNotifBindingKey.database";
import { EquipmentNotifBindingKey } from "../models/equipmentNotifBindingKey.model";

/**
 * This database is the link between equipments and notif groups: each row takes an equipment id and a notif group id.
 */
export class EquipmentNotifBindingKeyDatabaseService {
  constructor(protected server: Server) {}

  /**
   * creates a list of links
   * @param newEquipmentsNotifBindingKeys object containing an equipment id and a notif group id
   * @returns EquipmentNotifBindingKeyDatabaseInterface[]
   */
  async createEquipmentsNotifBindingKeys(
    newEquipmentsNotifBindingKeys: NewEquipmentNotifBindingKey[]
  ): Promise<EquipmentNotifBindingKeyDatabaseInterface[]> {
    logger.info("createEquipmentsNotifBindingKeys");
    try {
      return await EquipmentNotifBindingKey.bulkCreate(
        newEquipmentsNotifBindingKeys
      );
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  /**
   * retrieves all links between equipments and notif groups
   * @param equipmentId if set, retrieves links correspoding to that equipment
   * @param notifBindingKeyId if set, retrieves links correspoding to that notif group
   * @returns EquipmentNotifBindingKeyDatabaseInterface[]
   */
  async retrieveAllEquipmentsNotifBindingKeys(
    equipmentId: any,
    notifBindingKeyId: any
  ): Promise<EquipmentNotifBindingKeyDatabaseInterface[] | null> {
    logger.info("retrieveAllEquipmentsNotifBindingKeys");
    try {
      let result = [];
      if (equipmentId) {
        result = await EquipmentNotifBindingKey.findAll({
          where: {
            EquipmentId: equipmentId,
          },
        });
      } else if (notifBindingKeyId) {
        result = await EquipmentNotifBindingKey.findAll({
          where: {
            NotifBindingKeyId: notifBindingKeyId,
          },
        });
      } else {
        result = await EquipmentNotifBindingKey.findAll();
      }
      return result;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }
  /**
   *
   * @param equipmentsIds
   * @returns number[], list of notif binding keys ids
   */
  async retrieveAllNotifBindingKeysIdsFromEquipmentsIds(
    equipmentsIds: number[]
  ): Promise<number[]> {
    logger.info("retrieveAllNotifBindingKeysIdsFromEquipmentsIds");
    try {
      let result = [];
      result = await EquipmentNotifBindingKey.findAll({
        attributes: ["NotifBindingKeyId"],
        raw: true,
        where: {
          EquipmentId: equipmentsIds,
        },
      });
      return result.map(raw => raw.NotifBindingKeyId);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  /**
   *
   * @param notifBindingKeysIds
   * @returns number[], list of equipments ids
   */
  async retrieveAllEquipmentsIdsFromNotifBindingKeysIds(
    notifBindingKeysIds: number[]
  ): Promise<number[]> {
    logger.info("retrieveAllEquipmentsIdsFromNotifBindingKeysIds");
    try {
      let result = [];
      result = await EquipmentNotifBindingKey.findAll({
        attributes: ["EquipmentId"],
        raw: true,
        where: {
          NotifBindingKeyId: notifBindingKeysIds,
        },
      });
      return result.map(raw => raw.EquipmentId);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }
}
