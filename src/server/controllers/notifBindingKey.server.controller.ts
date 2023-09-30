import express from "express";
import { Server } from "http";
import { logger } from "../../../logger";
import { StatusCodes } from "http-status-codes";
import { NotifBindingKeyServerService } from "../services/notifBindingKey.server.service";
import { NotifBindingKeyServerInterface } from "../interfaces/notifBindingKey.server";
import {
  permissionsConstants,
  requirePermissions,
} from "../middlewares/permissions.server.middleware";

export const notifBindingKeyServerController = (server: Server) => {
  const service = new NotifBindingKeyServerService(server);

  const router = express.Router();
  router.use(express.json());

  router.get(
    "/",
    requirePermissions(permissionsConstants.NOTIF_BINDING_KEYS.READ),
    (req, res) => {
      // #swagger.summary = 'get all notif binding keys '
      (async () => {
        try {
          const notifBindingKeys = await service.getNotifBindingKeys();
          /* #swagger.responses[200] = {
            description: 'Returned notif binding keys',
            schema: [{
              id: 1,
              systemId: 1,
              name: 'notifBindingKey',
            }      ]
          } */
          res.status(StatusCodes.OK).json(notifBindingKeys);
        } catch (err) {
          logger.error("error while retrieving notif binding keys! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.get(
    "/:id",
    requirePermissions(permissionsConstants.NOTIF_BINDING_KEYS.READ),
    (req, res) => {
      // #swagger.summary = 'get a notif binding key by id '
      (async () => {
        try {
          const id = req.params.id;
          /* #swagger.parameters['id'] = {  
                in: 'path',
                type: 'integer',
                description: 'notif binding key ID.' } */
          const notifBindingKey = await service.getNotifBindingKeyById(id);
          /* #swagger.responses[200] = {
            description: 'Returned notif binding key by id',
            schema: {
              $id: 1,
              $name: 'notifBindingKey',
              $defaultMessageTtl: 1,
              $systemId: 1,
              $sendingMode: 'string',
            }      
          } */
          res.status(StatusCodes.OK).json(notifBindingKey);
        } catch (err) {
          logger.error("error while retrieving notif binding key by id! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.post(
    "/",
    requirePermissions(permissionsConstants.NOTIF_BINDING_KEYS.CREATE),
    (req, res) => {
      // #swagger.summary = 'add a notif binding key'
      (async () => {
        try {
          const addNotifBindingKey: NotifBindingKeyServerInterface = req.body;
          /*  #swagger.parameters['addNotifBindingKey'] = {
                in: 'body',
                description: '',
                schema: {
                      $systemId: 5,
                      $name: 'string',
                      equipmentIds: [1,2]
                }
        } */
          const { equipmentIds, ...rest } = addNotifBindingKey;
          const notifBindingKeyId = (
            await service.createNotifBindingKey(rest, equipmentIds)
          ).id;
          /* #swagger.responses[200] = {
            description: 'Returned notif binding key id',
            schema: {
              $id: 1,
              $name: 'string',
              $defaultMessageTtl: 2,
              $systemId: 1,
              $sendingMode: 'string',
            }
          } */
          res.status(StatusCodes.OK).json(notifBindingKeyId);
        } catch (err) {
          logger.error("error while creating notif binding key! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  // TODO LINK AS OTHER LINKS
  router.post(
    "/:id",
    requirePermissions(permissionsConstants.NOTIF_BINDING_KEYS.UPDATE),
    (req, res) => {
      // #swagger.summary = 'bind equipments to a notif binding key'
      (async () => {
        try {
          const id = req.params.id;
          /* #swagger.parameters['id'] = {
                in: 'path',
                type: 'integer',
                description: 'notif binding key ID.' } */
          const equipmentIds: number[] = req.body.equipmentIds;
          /*  #swagger.parameters['bindEquipmentsNotifBindingKey'] = {
                in: 'body',
                description: 'Array of equipment ids',
                schema: {
                      $equipmentIds: [1,2],
                }
        } */
          await service.bindEquipmentsBindingKey(equipmentIds, Number(id));
          res.sendStatus(StatusCodes.OK);
        } catch (err) {
          logger.error(
            "error while binding equipments to notif binding key! ",
            err
          );
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.put(
    "/:id",
    requirePermissions(permissionsConstants.NOTIF_BINDING_KEYS.UPDATE),
    (req, res) => {
      // #swagger.summary = 'update the name of a binding key'
      (async () => {
        try {
          const id = req.params.id;
          /* #swagger.parameters['id'] = {
                in: 'path',
                type: 'integer',
                description: 'notif binding key ID.' } */
          const params = req.body;
          /*  #swagger.parameters['updateNotifBindingKey'] = {

                in: 'body',
                description: 'new name of the binding key',
                schema: {
                      $name: 'string',
                }
        } */
          await service.modifyNotifBindingKey(id, params);
          res.sendStatus(StatusCodes.OK);
        } catch (err) {
          logger.error("error while updating notif binding key! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.delete(
    "/:id",
    requirePermissions(permissionsConstants.NOTIF_BINDING_KEYS.DELETE),
    (req, res) => {
      // #swagger.summary = 'delete one notif binding key by id '
      (async () => {
        try {
          const id = req.params.id;
          /* #swagger.parameters['id'] = {
                in: 'path',
                type: 'integer',
                description: 'notif binding key ID.' } */
          await service.deleteNotifBindingKey(id);
          res.sendStatus(StatusCodes.OK);
        } catch (err) {
          logger.error("error while deleting notif binding key! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  return router;
};
