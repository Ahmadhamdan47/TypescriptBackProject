import { Server } from "http";
import { logger } from "../../../logger";
import { NewNotifPredefinedMessage } from "../interfaces/notifPredefinedMessage.database";
import { NotifPredefinedMessage } from "../models/notifPredefinedMessage.model";

export class NotifPredefinedMessageDatabaseService {
  constructor(protected server: Server) {}

  async createOneNotifPredefinedMessage(
    newNotifPredefinedMessage: NewNotifPredefinedMessage
  ): Promise<NotifPredefinedMessage> {
    logger.info("createOneNotifPredefinedMessage");
    try {
      const currentMessages = await this.retrieveAllNotifPredefinedMessages();
      // check if the message already exists
      if (currentMessages) {
        const messageExists = currentMessages.find(
          message => message.title === newNotifPredefinedMessage.title
        );
        if (messageExists) {
          throw new Error("Title already exists");
        }
      }

      return await NotifPredefinedMessage.create(newNotifPredefinedMessage);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async updateNotifPredefinedMessageFromId(
    id: string,
    message: any
  ): Promise<void> {
    logger.info("updateNotifPredefinedMessageFromId");
    try {
      await NotifPredefinedMessage.update(message, {
        where: {
          id,
        },
      });
      return;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveAllNotifPredefinedMessages(): Promise<
    NotifPredefinedMessage[] | null
  > {
    logger.info("retrieveAllNotifPredefinedMessages");
    try {
      return await NotifPredefinedMessage.findAll();
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveOneNotifPredefinedMessage(
    id: string
  ): Promise<NotifPredefinedMessage | null> {
    logger.info("retrieveOneNotifPredefinedMessage");
    try {
      return await NotifPredefinedMessage.findByPk(id);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async deleteNotifPredefinedMessagesFromIds(data?: {
    ids?: number[];
  }): Promise<void> {
    logger.info("deleteNotifPredefinedMessagesFromIds");
    try {
      await NotifPredefinedMessage.destroy({
        where: data?.ids ? { id: data.ids } : {},
      });
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async deleteOneNotifPredefinedMessage(id: string): Promise<void> {
    logger.info("deleteOneNotifPredefinedMessage");
    try {
      await NotifPredefinedMessage.destroy({
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
