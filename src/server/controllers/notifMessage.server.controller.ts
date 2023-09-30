import express from "express";
import { Server } from "http";
import { logger } from "../../../logger";
import { NotifMessageServerService } from "../services/notifMessage.server.service";
import { StatusCodes } from "http-status-codes";
import { NotifMessageServerInterface } from "../interfaces/notifMessage.server";
import {
  permissionsConstants,
  requirePermissions,
} from "../middlewares/permissions.server.middleware";

export const notifMessageServerController = (server: Server) => {
  const service = new NotifMessageServerService(server);

  const router = express.Router();
  router.use(express.json());

  /* ============================================================================================
   *
   * REQUESTS FOR PREDEFINED NOTIF MESSAGES
   *
   * ============================================================================================ */

  router.post(
    "/",
    requirePermissions(permissionsConstants.NOTIF_MESSAGES.CREATE),
    (req, res) => {
      // #swagger.summary = 'save a Notif Predefined Message'
      (async () => {
        try {
          const newNotifPredefinedMessage: NotifMessageServerInterface =
            req.body;
          /*  #swagger.parameters['message'] = {
              in: 'body',
              description: 'save notif message ',
              schema: {
                $title: 'string',
                $body: 'string',
                $messageTtl: 3600,
                $messageDelay: 3600,
                $priority: 'string',
                $sender: 'string',
                $enclosed_file: 'string',
                $bindingKeys: 'number[]',
              }
            } */
          const notifPredefinedMessage =
            await service.insertNotifPredefinedMessage(
              newNotifPredefinedMessage
            );
          /* #swagger.responses[200] = {
                description: 'Returned notif predefined message id',
                schema: {
                      $id: 1,
                      $title: 'string',
                      $body: 'string',
                      $messageTtl: 3600,
                      $messageDelay: 3600,
                      $priority: 'string',
                      $sender: 'string',
                }
        } */
          res.status(StatusCodes.OK).json(notifPredefinedMessage);
        } catch (err) {
          logger.error("error while saving notif message! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.get(
    "/",
    requirePermissions(permissionsConstants.NOTIF_MESSAGES.READ),
    (req, res) => {
      // #swagger.summary = 'get all notif predefined messages '
      (async () => {
        try {
          const messages = await service.getNotifPredefinedMessages();
          /* #swagger.responses[200] = {
            description: 'Returned notif predefined messages',
            schema: [{
              $id: 1,
              $title: 'string',
              $body: 'string',
              $messageTtl: 3600,
              $messageDelay: 3600,
              $priority: 'string',
              $sender: 'string',
            }      ]
          } */
          res.status(StatusCodes.OK).json(messages);
        } catch (err) {
          logger.error("error while retrieving notif messages! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.put(
    "/:id",
    requirePermissions(permissionsConstants.NOTIF_MESSAGES.UPDATE),
    (req, res) => {
      // #swagger.summary = 'update a notif predefined message'
      (async () => {
        try {
          const message = req.body;
          /*  #swagger.parameters['message'] = {
                in: 'body',
                description: 'update notif predefined message',
                schema: {
                      $title: 'string',
                      $body: 'string',
                      $messageTtl: 3600,
                      $messageDelay: 3600,
                      $priority: 'string',
                      $sender: 'string',
                }
        } */
          await service.updateNotifPredefinedMessage(req.params.id, message);
          res.sendStatus(StatusCodes.OK);
        } catch (err) {
          logger.error("error while updating notif message! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.delete(
    "/:id",
    requirePermissions(permissionsConstants.NOTIF_MESSAGES.DELETE),
    (req, res) => {
      // #swagger.summary = 'delete a notif predefined message'
      (async () => {
        try {
          const id = req.params.id;
          /* #swagger.parameters['id'] = {
                in: 'path',
                type: 'integer',
                description: 'notif message ID.' } */
          await service.deleteNotifPredefinedMessage(id);
          res.sendStatus(StatusCodes.OK);
        } catch (err) {
          logger.error("error while deleting notif message! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  /* ============================================================================================
   *
   * REQUESTS FOR HISTORIZED NOTIF MESSAGES
   *
   * ============================================================================================ */

  router.get(
    "/history",
    requirePermissions(permissionsConstants.NOTIF_MESSAGES.READ),
    (req, res) => {
      // #swagger.summary = 'get all notif historized messages '
      (async () => {
        try {
          const messages = await service.getNotifHistorizedMessages();
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
            }      ]
          } */
          res.status(StatusCodes.OK).json(messages);
        } catch (err) {
          logger.error("error while retrieving notif messages! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  /* ============================================================================================
   *
   * REQUESTS FOR SENT MESSAGES
   *
   * ============================================================================================ */

  router.post(
    "/send",
    requirePermissions(permissionsConstants.NOTIF_MESSAGES.CREATE),
    (req, res) => {
      // #swagger.summary = 'send a Notif Message'
      (async () => {
        try {
          const message: NotifMessageServerInterface = req.body;
          /*  #swagger.parameters['message'] = {
                in: 'body',
                description: 'send notif message ',
                schema: {
                      $title: 'string',
                      $body: 'string',
                      $messageTtl: 3600,
                      $messageDelay: 0,
                      $priority: 'string',
                      $sender: 'string',
                      $enclosed_file: 'string',
                      $bindingKeys: [1,2],
                }
        } */
          const ret = await service.sendNotifMessage(message);
          /* #swagger.responses[200] = {
                description: 'Returned notif message id',
                schema: [true]
        } */
          res.status(StatusCodes.OK).json(ret);
        } catch (err) {
          logger.error("error while sending notif message! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.delete(
    "/sent/:id",
    requirePermissions(permissionsConstants.NOTIF_MESSAGES.DELETE),
    (req, res) => {
      // #swagger.summary = 'delete a sent notif message'
      (async () => {
        try {
          const id = req.params.id;
          /* #swagger.parameters['id'] = {
                in: 'path',
                type: 'integer',
                description: 'notif message ID.' } */
          await service.deleteNotifMessageFromNotifServer(id);
          res.sendStatus(StatusCodes.OK);
        } catch (err) {
          logger.error("error while deleting notif message! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  /* ============================================================================================
   *
   * REQUESTS FOR DELAYED MESSAGES
   *
   * ============================================================================================ */

  router.post(
    "/delay",
    requirePermissions(permissionsConstants.NOTIF_MESSAGES.CREATE),
    (req, res) => {
      // #swagger.summary = 'send a Notif Message'
      (async () => {
        try {
          const message: NotifMessageServerInterface = req.body;
          /*  #swagger.parameters['message'] = {
            in: 'body',
            description: 'send notif message ',
            schema: {
              $title: 'string',
              $body: 'string',
              $messageTtl: 3600,
              $messageDelay: 3600,
              $priority: 'string',
              $sender: 'string',
              $enclosed_file: 'string',
              $bindingKeys: [1,2],
            }
          } */
          const id = await service.delayNotifMessage(message);
          /* #swagger.responses[200] = {
            description: 'Returned notif message id',
            schema: {
              $id: 1,
            }
          } */
          res.status(StatusCodes.OK).json(id);
        } catch (err) {
          logger.error("error while sending notif message! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.put(
    "/delay/:historyId",
    requirePermissions(permissionsConstants.NOTIF_MESSAGES.UPDATE),
    (req, res) => {
      // #swagger.summary = 'update a delayed notif message'
      (async () => {
        try {
          const historyId = req.params.historyId;
          /* #swagger.parameters['id'] = {
                in: 'path',
                type: 'integer',
                description: 'notif message ID.' } */
          const message = req.body;
          /*  #swagger.parameters['message'] = {
                in: 'body',
                description: 'update delayed notif message',
                schema: {
                      $title: 'string',
                      $body: 'string',
                      $messageTtl: 3600,
                      $messageDelay: 3600,
                      $priority: 'string',
                      $sender: 'string',
                      $enclosed_file: 'string',
                }
        } */
          await service.updateNotifHistorizedMessage(historyId, message);
          res.sendStatus(StatusCodes.OK);
        } catch (err) {
          logger.error("error while updating notif message! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.delete(
    "/delay/:jobId/:messageId",
    requirePermissions(permissionsConstants.NOTIF_MESSAGES.DELETE),
    (req, res) => {
      // #swagger.summary = 'cancel a delayed notif message'
      (async () => {
        try {
          const jobId = req.params.jobId;
          /* #swagger.parameters['jobId'] = {
                in: 'path',
                type: 'integer',
                description: 'job ID.' } */
          const messageId = req.params.messageId;
          /* #swagger.parameters['messageId'] = {
                in: 'path',
                type: 'integer',
                description: 'message ID.' } */
          await service.cancelDelayedNotifMessage(jobId, messageId);
          res.sendStatus(StatusCodes.OK);
        } catch (err) {
          logger.error("error while deleting notif message! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  return router;
};
