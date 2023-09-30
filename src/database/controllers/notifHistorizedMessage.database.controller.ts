import express from "express";
import { Server } from "http";
import { logger } from "../../../logger";
import { StatusCodes } from "http-status-codes";
import { NotifHistorizedMessageDatabaseService as NotifHistorizedMessageDatabaseService } from "../services/notifHistorizedMessage.database.service";

export const notifHistorizedMessageDatabaseController = (
  notifHistorizedMessage: Server
) => {
  const service = new NotifHistorizedMessageDatabaseService(
    notifHistorizedMessage
  );

  const router = express.Router();
  router.use(express.json());

  router.get("/", (req, res) => {
    // #swagger.summary = 'get all notif historized messages '
    (async () => {
      try {
        const notifHistorizedMessages =
          await service.retrieveAllNotifHistorizedMessages();
        /* #swagger.responses[200] = {
            description: 'Returned notif historized messages',
            schema: [{
              $id: 1,
              $title: 'string',
              $body: 'string',
              $messageTtl: 3600,
              $messageDelay: 3600,
              $priority: 'string',
              $sender: 'string',
              $notifBindingKeysIds: 'string',
              $notifBindingKeysNames: 'string',
              $messageUuid: 'string',
              $status: 'string',
              $systemId: 1
            }      ]
          } */
        res.status(StatusCodes.OK).json(notifHistorizedMessages);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.get("/:id", (req, res) => {
    // #swagger.summary = 'get one notif historized message by id '
    (async () => {
      try {
        const id = req.params.id;
        /*  #swagger.parameters['id'] = {
          in: 'path',
          type: 'integer',
          description: 'notif historized message ID.' } */
        const notifHistorizedMessage =
          await service.retrieveOneNotifHistorizedMessage(id);
        /* #swagger.responses[200] = {
            description: 'Returned notif historized message',
            schema: {
              $id: 1,
              $title: 'string',
              $body: 'string',
              $messageTtl: 3600,
              $messageDelay: 3600,
              $priority: 'string',
              $sender: 'string',
              $notifBindingKeysIds: 'string',
              $notifBindingKeysNames: 'string',
              $messageUuid: 'string',
              $status: 'string',
              $systemId: 1
            }
          } */
        res.status(StatusCodes.OK).json(notifHistorizedMessage);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.post("/", (req, res) => {
    // #swagger.summary = 'create a notif historized message'
    (async () => {
      try {
        const newNotifHistorizedMessage = req.body;
        /*  #swagger.parameters['notifHistorizedMessage'] = {
            in: 'body',
            description: 'new notif historized message object ',
            schema: {
                    $title: 'string',
                    $body: 'string',
                    $messageTtl: 3600,
                    $messageDelay: 3600,
                    $priority: 'string',
                    $sender: 'string',
                    enclosed_file: 'string',
                    $notifBindingKeysIds: [1, 2],
                    $status: 'string',
                    $systemId: 4
                }
    } */
        const notifHistorizedMessage =
          await service.createOneNotifHistorizedMessage(
            newNotifHistorizedMessage
          );
        /* #swagger.responses[201] = {
            description: 'Returned notif historized message',
            schema: {
              $id: 1,
              $title: 'string',
              $body: 'string',
              $messageTtl: 3600,
              $messageDelay: 3600,
              $priority: 'string',
              $sender: 'string',
              $notifBindingKeysIds: 'string',
              $notifBindingKeysNames: 'string',
              $messageUuid: 'string',
              $status: 'string',
              $systemId: 1
            }
          } */
        res.status(StatusCodes.CREATED).json(notifHistorizedMessage);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.put("/:id", (req, res) => {
    // #swagger.summary = 'update one notif historized message by id '
    (async () => {
      try {
        const id = req.params.id;
        /*  #swagger.parameters['id'] = {
          in: 'path',
          type: 'integer',
          description: 'notif historized message ID.' } */
        const notifHistorizedMessage = req.body;
        /*  #swagger.parameters['notifHistorizedMessage'] = {
            in: 'body',
            description: 'updated notif historized message object ',
            schema: {
                    $status: 'string'
                }
    } */
        await service.updateNotifHistorizedMessageFromId(
          id,
          notifHistorizedMessage
        );
        res.sendStatus(StatusCodes.OK);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.delete("/", (req, res) => {
    // #swagger.summary = 'delete all notif historized messages '
    (async () => {
      try {
        const ids = req.body;
        /*  #swagger.parameters['ids'] = {
          in: 'body',
          description: 'notif historized messages ids',
          schema: {
            ids:[1, 2, 3]
          }
        } */
        await service.deleteNotifHistorizedMessagesFromIds(ids);
        res.sendStatus(StatusCodes.OK);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.delete("/:id", (req, res) => {
    // #swagger.summary = 'delete one notif historized message by id '
    (async () => {
      try {
        const id = req.params.id;
        /*  #swagger.parameters['id'] = {
          in: 'path',
          type: 'integer',
          description: 'notif historized message ID.' } */
        await service.deleteOneNotifHistorizedMessage(id);
        res.sendStatus(StatusCodes.OK);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });
  return router;
};
