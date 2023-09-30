import { Server } from "http";
import { logger } from "../../../logger";
import {
  NewNotifPredefinedMessageNotifBindingKey,
  NotifPredefinedMessageNotifBindingKeyDatabaseInterface,
} from "../interfaces/notifPredefinedMessageNotifBindingKey.database";
import { NotifPredefinedMessageNotifBindingKey } from "../models/notifPredefinedMessageNotifBindingKey.model";

/**
 * This database is the link between notifPredefinedMessages and notif groups: each row takes an notifPredefinedMessage id and a notif group id.
 */
export class NotifPredefinedMessageNotifBindingKeyDatabaseService {
  constructor(protected server: Server) {}

  /**
   * creates a list of links
   * @param newNotifPredefinedMessagesNotifBindingKeys object containing an notifPredefinedMessage id and a notif group id
   * @returns NotifPredefinedMessageNotifBindingKeyDatabaseInterface[]
   */
  async createNotifPredefinedMessagesNotifBindingKeys(
    newNotifPredefinedMessagesNotifBindingKeys: NewNotifPredefinedMessageNotifBindingKey[]
  ): Promise<NotifPredefinedMessageNotifBindingKeyDatabaseInterface[]> {
    logger.info("createNotifPredefinedMessagesNotifBindingKeys");
    try {
      return await NotifPredefinedMessageNotifBindingKey.bulkCreate(
        newNotifPredefinedMessagesNotifBindingKeys
      );
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  /**
   * retrieves all links between notifPredefinedMessages and notif groups
   * @param notifPredefinedMessageId if set, retrieves links correspoding to that notifPredefinedMessage
   * @param notifBindingKeyId if set, retrieves links correspoding to that notif group
   * @returns NotifPredefinedMessageNotifBindingKeyDatabaseInterface[]
   */
  async retrieveAllNotifPredefinedMessagesNotifBindingKeys(
    notifPredefinedMessageId: any,
    notifBindingKeyId: any
  ): Promise<NotifPredefinedMessageNotifBindingKeyDatabaseInterface[] | null> {
    logger.info("retrieveAllNotifPredefinedMessagesNotifBindingKeys");
    try {
      let result = [];
      if (notifPredefinedMessageId) {
        result = await NotifPredefinedMessageNotifBindingKey.findAll({
          where: {
            NotifPredefinedMessageId: notifPredefinedMessageId,
          },
        });
      } else if (notifBindingKeyId) {
        result = await NotifPredefinedMessageNotifBindingKey.findAll({
          where: {
            NotifBindingKeyId: notifBindingKeyId,
          },
        });
      } else {
        result = await NotifPredefinedMessageNotifBindingKey.findAll();
      }
      return result;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }
  /**
   *
   * @param notifPredefinedMessagesIds
   * @returns number[], list of notif groups ids from notifPredefinedMessages ids
   */
  async retrieveAllNotifBindingKeysIdsFromNotifPredefinedMessagesIds(
    notifPredefinedMessagesIds: number[]
  ): Promise<number[]> {
    logger.info("retrieveAllNotifBindingKeysIdsFromNotifPredefinedMessagesIds");
    try {
      let result = [];
      result = await NotifPredefinedMessageNotifBindingKey.findAll({
        attributes: ["NotifBindingKeyId"],
        raw: true,
        where: {
          NotifPredefinedMessageId: notifPredefinedMessagesIds,
        },
      });
      return result.map(raw => raw.NotifBindingKeyId);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }
}
