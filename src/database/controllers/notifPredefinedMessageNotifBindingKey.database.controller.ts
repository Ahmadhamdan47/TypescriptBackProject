import express from "express";
import { Server } from "http";
import { logger } from "../../../logger";
import { StatusCodes } from "http-status-codes";
import { NewNotifPredefinedMessageNotifBindingKey } from "../interfaces/notifPredefinedMessageNotifBindingKey.database";
import { NotifPredefinedMessageNotifBindingKeyDatabaseService } from "../services/notifPredefinedMessageNotifBindingKey.database.service";

export const notifPredefinedMessageNotifBindingKeyDatabaseController = (
  server: Server
) => {
  const service = new NotifPredefinedMessageNotifBindingKeyDatabaseService(
    server
  );

  const router = express.Router();
  router.use(express.json());

  router.get("/", (req, res) => {
    // #swagger.summary = 'get all notif messages and notif binding keys linked'
    (async () => {
      try {
        const notifPredefinedMessageId = req.query.notifPredefinedMessageId;
        /*  #swagger.parameters['notifPredefinedMessageId'] = {
          in: 'query',
          type: 'integer',
          description: 'notif predefined message ID.' } */
        const notifBindingKeyId = req.query.notifBindingKeyId;
        /*  #swagger.parameters['notifBindingKeyId'] = {
          in: 'query',
          type: 'integer',
          description: 'notif binding key ID.' } */
        const notifPredefinedMessageNotifBindingKeys =
          await service.retrieveAllNotifPredefinedMessagesNotifBindingKeys(
            notifPredefinedMessageId,
            notifBindingKeyId
          );
        /* #swagger.responses[200] = {
            description: 'Returned notif binding keys ids and notifPredefinedMessages ids linked',
            schema: [{
              $NotifBindingKeyId: 1,
              $NotifPredefinedMessageId: 2,
            }      ]
          } */
        res.status(StatusCodes.OK).json(notifPredefinedMessageNotifBindingKeys);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.post("/notifBindingKeysIds", (req, res) => {
    // #swagger.summary = 'get all notif binding keys ids from notifPredefinedMessages ids'
    (async () => {
      try {
        const ids = req.body;
        /*  #swagger.parameters['ids'] = {
          in: 'body',
          description: 'notif predefined messages ids',
          schema: {
            $ids:[1, 2, 3]
          }
        } */
        const notifBindingKeysIds =
          await service.retrieveAllNotifBindingKeysIdsFromNotifPredefinedMessagesIds(
            ids
          );
        /* #swagger.responses[200] = {
            description: 'Returned notif binding keys ids',
            schema: [1, 2, 3]
          } */
        res.status(StatusCodes.OK).json(notifBindingKeysIds);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.post("/", (req, res) => {
    // #swagger.summary = 'create a list of notif binding keys ids and notifPredefinedMessages ids linked'
    (async () => {
      try {
        const newNotifPredefinedMessageNotifBindingKeys =
          req.body as NewNotifPredefinedMessageNotifBindingKey[];
        /*  #swagger.parameters['notifPredefinedMessageNotifBindingKeys'] = {
            in: 'body',
            description: 'new notif binding keys ids and notifPredefinedMessages ids linked',
            schema: [{
              $NotifBindingKeyId: 1,
              $NotifPredefinedMessageId: 2,
            }      ]
          } */
        const notifPredefinedMessageNotifBindingKeys =
          await service.createNotifPredefinedMessagesNotifBindingKeys(
            newNotifPredefinedMessageNotifBindingKeys
          );
        res.sendStatus(StatusCodes.CREATED);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  return router;
};
