import { Server } from "http";
import { logger } from "../../../logger";
import { NewNotifHistorizedMessage } from "../interfaces/notifHistorizedMessage.database";
import { NotifHistorizedMessage } from "../models/notifHistorizedMessage.model";
import { NotifMessageHistoryInterface } from "../../server/interfaces/notifMessage.server";
import { NotifBindingKeyDatabaseService } from "./notifBindingKey.database.service";

export class NotifHistorizedMessageDatabaseService {
  constructor(protected server: Server) {}
  notifBindingKeyService = new NotifBindingKeyDatabaseService(this.server);

  async createOneNotifHistorizedMessage(
    message: NotifMessageHistoryInterface
  ): Promise<number> {
    logger.info("createOneNotifHistorizedMessage");
    try {
      // get notif binding keys names from ids
      const notifBindingKeysNames = await Promise.all(
        message.notifBindingKeysIds.map(
          async id =>
            (await this.notifBindingKeyService.retrieveOneNotifBindingKey(
              id.toString()
            ))!.name
        )
      );
      const newNotifHistorizedMessage: NewNotifHistorizedMessage = {
        serverUuid: message.messageUuid,
        status: message.status,
        systemId: message.systemId,
        title: message.title,
        body: message.body,
        messageTtl: message.messageTtl,
        messageDelay: message.messageDelay,
        priority: message.priority,
        sender: message.sender,
        notifBindingKeysIds: message.notifBindingKeysIds.join(";"),
        notifBindingKeysNames: notifBindingKeysNames.join(";"),
      };

      return (await NotifHistorizedMessage.create(newNotifHistorizedMessage))
        .id;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveAllNotifHistorizedMessages(): Promise<
    NotifHistorizedMessage[] | null
  > {
    logger.info("retrieveAllNotifHistorizedMessages");
    try {
      return await NotifHistorizedMessage.findAll();
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveOneNotifHistorizedMessage(
    id: string
  ): Promise<NotifHistorizedMessage | null> {
    logger.info("retrieveOneNotifHistorizedMessage");
    try {
      return await NotifHistorizedMessage.findByPk(id);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async updateNotifHistorizedMessageFromId(
    id: string,
    message: any
  ): Promise<void> {
    logger.info("updateNotifHistorizedMessageFromId");
    try {
      await NotifHistorizedMessage.update(message, {
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

  async deleteNotifHistorizedMessagesFromIds(data?: {
    ids: number[];
  }): Promise<void> {
    logger.info("deleteNotifHistorizedMessagesFromIds");
    try {
      await NotifHistorizedMessage.destroy({
        where: data?.ids ? { id: data.ids } : {},
      });
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async deleteOneNotifHistorizedMessage(id: string): Promise<void> {
    logger.info("deleteOneNotifHistorizedMessage");
    try {
      await NotifHistorizedMessage.destroy({
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
