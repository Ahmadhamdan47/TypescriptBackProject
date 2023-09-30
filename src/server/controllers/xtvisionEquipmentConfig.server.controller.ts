import express from "express";
import { Server } from "http";
import { logger } from "../../../logger";
import { StatusCodes } from "http-status-codes";
import { XtvisionEquipmentConfigServerService } from "../services/xtvisionEquipmentConfig.server.service";
import {
  permissionsConstants,
  requirePermissions,
} from "../middlewares/permissions.server.middleware";

export const xtvisionEquipmentConfigServerController = (server: Server) => {
  const service = new XtvisionEquipmentConfigServerService(server);

  const router = express.Router();
  router.use(express.json());

  router.get(
    "/",
    requirePermissions(permissionsConstants.EQUIPMENTS.READ),
    (req, res) => {
      // #swagger.summary = 'get all xtvision equipment configs'
      (async () => {
        try {
          const xtvisionEquipmentConfigs =
            await service.getXtvisionEquipmentConfigs();
          /* #swagger.responses[200] = {
              description: 'Returned xtvision equipment configs',
              schema: [{
                $equipmentId: 1,
                $isSupervised: false
              }      ]
            } */
          res.status(StatusCodes.OK).json(xtvisionEquipmentConfigs);
        } catch (err) {
          logger.error("error while retrieving xtvision equipment configs! ");
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.put(
    "/:id",
    requirePermissions(permissionsConstants.EQUIPMENTS.UPDATE),
    (req, res) => {
      // #swagger.summary = 'update a xtvision equipment config'
      (async () => {
        try {
          const id = req.params.id;
          /* #swagger.parameters['id'] = {
                in: 'path',
                type: 'integer',
                description: 'xtvision equipment config ID.' } */
          const xtvisionEquipmentConfig = req.body;
          /*  #swagger.parameters['xtvisionEquipmentConfig'] = {
                in: 'xtvisionEquipmentConfig',
                description: 'xtvision equipment config to update',
                schema: {
                      $isSupervised: true
                }
        } */
          await service.updateXtvisionEquipmentConfig(
            id,
            xtvisionEquipmentConfig
          );
          res.sendStatus(StatusCodes.OK);
        } catch (err) {
          logger.error("error while updating xtvision equipment config! ");
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  return router;
};
