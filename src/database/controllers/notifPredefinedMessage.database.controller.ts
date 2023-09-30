import express from "express";
import { Server } from "http";
import { logger } from "../../../logger";
import { StatusCodes } from "http-status-codes";
import { NewNotifPredefinedMessage } from "../interfaces/notifPredefinedMessage.database";
import { NotifPredefinedMessageDatabaseService } from "../services/notifPredefinedMessage.database.service";

export const notifPredefinedMessageDatabaseController = (
  notifPredefinedMessage: Server
) => {
  const service = new NotifPredefinedMessageDatabaseService(
    notifPredefinedMessage
  );

  const router = express.Router();
  router.use(express.json());

  router.get("/", (req, res) => {
    // #swagger.summary = 'get all notif predefined messages '
    (async () => {
      try {
        const notifPredefinedMessages =
          await service.retrieveAllNotifPredefinedMessages();
        /* #swagger.responses[200] = {
            description: 'Returned notif predefined messages',
            schema: [{
              $id: 1,
              $title: 'string',
              $body: 'string',
              $messageTtl: 3600,
              $messageDelay: 0,
              $priority: 'string',
              $sender: 'string',
            }      ]
          } */
        res.status(StatusCodes.OK).json(notifPredefinedMessages);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.get("/:id", (req, res) => {
    // #swagger.summary = 'get one notif predefined message by id '
    (async () => {
      try {
        const id = req.params.id;
        /*  #swagger.parameters['id'] = {
          in: 'path',
          type: 'integer',
          description: 'notif predefined message ID.' } */
        const notifPredefinedMessage =
          await service.retrieveOneNotifPredefinedMessage(id);
        /* #swagger.responses[200] = {
            description: 'Returned notif predefined message',
            schema: {
              $id: 1,
              $title: 'string',
              $body: 'string',
              $messageTtl: 3600,
              $messageDelay: 0,
              $priority: 'string',
              $sender: 'string',
            }
          } */
        res.status(StatusCodes.OK).json(notifPredefinedMessage);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.post("/", (req, res) => {
    // #swagger.summary = 'create a notif predefined message'
    (async () => {
      try {
        const newNotifPredefinedMessage = req.body as NewNotifPredefinedMessage;
        /*  #swagger.parameters['notifPredefinedMessage'] = {
            in: 'body',
            description: 'new notif predefined message object ',
            schema: {
                    $title: 'string',
                    $body: 'string',
                    $messageTtl: 3600,
                    $messageDelay: 0,
                    $priority: 'string',
                    $sender: 'string',
            }
    } */
        const notifPredefinedMessage =
          await service.createOneNotifPredefinedMessage(
            newNotifPredefinedMessage
          );
        /* #swagger.responses[201] = {
            description: 'Returned notif predefined message',
            schema: {
              $id: 1,
              $title: 'string',
              $body: 'string',
              $messageTtl: 3600,
              $messageDelay: 0,
              $priority: 'string',
              $sender: 'string',
            }
          } */
        res.status(StatusCodes.CREATED).json(notifPredefinedMessage);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.put("/:id", (req, res) => {
    // #swagger.summary = 'update a notif predefined message'
    (async () => {
      try {
        const id = req.params.id;
        /*  #swagger.parameters['id'] = {
          in: 'path',
          type: 'integer',
          description: 'notif predefined message ID.' } */
        const message: NewNotifPredefinedMessage = req.body;
        /*  #swagger.parameters['notifPredefinedMessage'] = {
            in: 'body',
            description: 'change group name',
            schema: {
                    title: 'string',
                    body: 'string',
                    messageTtl: 3600,
                    messageDelay: 0,
                    priority: 'string',
                    sender: 'string',
                }
    } */
        await service.updateNotifPredefinedMessageFromId(id, message);
        res.sendStatus(StatusCodes.OK);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.delete("/", (req, res) => {
    // #swagger.summary = 'delete all notif predefined messages '
    (async () => {
      try {
        const ids = req.body;
        /*  #swagger.parameters['ids'] = {
          in: 'body',
          description: 'notif predefined messages ids',
          schema: {
            ids:[1, 2, 3]
          }
        } */
        await service.deleteNotifPredefinedMessagesFromIds(ids);
        res.sendStatus(StatusCodes.OK);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.delete("/:id", (req, res) => {
    // #swagger.summary = 'delete one notif predefined message by id '
    (async () => {
      try {
        const id = req.params.id;
        /*  #swagger.parameters['id'] = {
          in: 'path',
          type: 'integer',
          description: 'notif predefined message ID.' } */
        await service.deleteOneNotifPredefinedMessage(id);
        res.sendStatus(StatusCodes.OK);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });
  return router;
};
