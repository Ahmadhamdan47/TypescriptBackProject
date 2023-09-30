import { Server } from "http";
import { logger } from "../../../logger";
import { NewNotifBindingKey } from "../interfaces/notifBindingKey.database";
import { NotifBindingKey } from "../models/notifBindingKey.model";

export class NotifBindingKeyDatabaseService {
  constructor(protected server: Server) {}

  async createOneNotifBindingKey(
    newNotifBindingKey: NewNotifBindingKey
  ): Promise<NotifBindingKey> {
    logger.info("createOneNotifBindingKey");
    try {
      return await NotifBindingKey.create(newNotifBindingKey);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async updateNotifBindingKeyNameFromId(id: string, name: any): Promise<void> {
    logger.info("updateNotifBindingKeyNameFromId");
    try {
      await NotifBindingKey.update(
        { name },
        {
          where: {
            id,
          },
        }
      );
      return;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveAllNotifBindingKeys(): Promise<NotifBindingKey[] | null> {
    logger.info("retrieveAllNotifBindingKeys");
    try {
      return await NotifBindingKey.findAll();
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveAllNotifBindingKeysIdsFromSystemId(
    systemId: any
  ): Promise<number[] | null> {
    logger.info("retrieveAllNotifBindingKeysIdsFromSystemId");
    try {
      let result = [];
      result = await NotifBindingKey.findAll({
        attributes: ["id"],
        raw: true,
        where: {
          systemId: systemId,
        },
      });
      return result.map(raw => raw.id);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveOneNotifBindingKey(
    id: string
  ): Promise<NotifBindingKey | null> {
    logger.info("retrieveOneNotifBindingKey");
    try {
      const result = await NotifBindingKey.findByPk(id);
      return result;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async deleteNotifBindingKeysFromIds(data?: { ids: number[] }): Promise<void> {
    logger.info("deleteNotifBindingKeysFromIds");
    try {
      await NotifBindingKey.destroy({
        where: data?.ids ? { id: data.ids } : {},
      });
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async deleteOneNotifBindingKey(id: string): Promise<void> {
    logger.info("deleteOneNotifBindingKey");
    try {
      await NotifBindingKey.destroy({
        where: {
          id,
        },
      });
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }
}
