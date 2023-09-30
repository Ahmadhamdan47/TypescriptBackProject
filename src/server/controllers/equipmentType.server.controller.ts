import express from "express";
import { Server } from "http";
import { logger } from "../../../logger";
import { StatusCodes } from "http-status-codes";
import { EquipmentTypeServerService } from "../services/equipmentType.server.service";
import {
  permissionsConstants,
  requirePermissions,
} from "../middlewares/permissions.server.middleware";

export const equipmentTypeServerController = (server: Server) => {
  const service = new EquipmentTypeServerService(server);

  const router = express.Router();
  router.use(express.json());

  router.get(
    "/",
    requirePermissions(permissionsConstants.EQUIPMENT_TYPES.READ),
    (req, res) => {
      // #swagger.summary = 'get all equipment types'
      (async () => {
        try {
          const equipmentsTypes = await service.getEquipmentsTypes();
          /* #swagger.responses[200] = {
            description: 'Returned equipment types',
            schema: [{
              $id: 1,
              $name: 'string',
              $systemId: 1,
            }      ]
          } */
          res.status(StatusCodes.OK).json(equipmentsTypes);
        } catch (err) {
          logger.error("error while retrieving all equipment types! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.get(
    "/:id/actionsTypes",
    requirePermissions(permissionsConstants.EQUIPMENT_TYPES.READ),
    (req, res) => {
      // #swagger.summary = 'get action types from type equipment id'
      (async () => {
        try {
          const id = req.params.id;
          /* #swagger.parameters['id'] = {
                in: 'path',
                type: 'integer',
                description: 'type equipment ID.' } */
          const actionsTypes = await service.getActionsTypesFromEquipmentTypeId(
            id
          );
          /* #swagger.responses[200] = {
            description: 'Returned action types from type equipment id',
            schema: [{
              $id: 1,
              $name: 'string',
              $equipmentPropertyId: 7,
              $Params: [{ 
                $id: 2,
                $nameId: 'string',
                $labelFr: 'string',
                $labelEn: 'string',
                $kind: 'string',
                paramValues: 'string'
              }]
            }   ]
          } */
          res.status(StatusCodes.OK).json(actionsTypes);
        } catch (err) {
          logger.error(
            "error while retrieving action types from type equipment id! ",
            err
          );
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.get(
    "/:id/states",
    requirePermissions(permissionsConstants.EQUIPMENT_TYPES.READ),
    (req, res) => {
      // #swagger.summary = 'get states from type equipment id'
      (async () => {
        try {
          const id = req.params.id;
          /* #swagger.parameters['id'] = {
                in: 'path',
                type: 'integer',
                description: 'type equipment ID.' } */
          const states = await service.getStatesFromEquipmentTypeId(id);
          /* #swagger.responses[200] = {
            description: 'Returned states from type equipment id',
            schema: [{
              $id: 1,
              $name: 'string',
              $equipmentPropertyId: 7,
              $Params: [{ 
                $id: 2,
                $nameId: 'string',
                $labelFr: 'string',
                $labelEn: 'string',
                $kind: 'string',
                paramValues: 'string'
              }]
            }   ]
          } */
          res.status(StatusCodes.OK).json(states);
        } catch (err) {
          logger.error(
            "error while retrieving states from type equipment id! "
          );
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.get(
    "/:id/equipments",
    requirePermissions(permissionsConstants.EQUIPMENT_TYPES.READ),
    (req, res) => {
      // #swagger.summary = 'get equipments from type equipment id'
      (async () => {
        try {
          const id = req.params.id;
          /* #swagger.parameters['id'] = {
                in: 'path',
                type: 'integer',
                description: 'type equipment ID.' } */
          const equipments = await service.getEquipmentsFromEquipmentTypeId(id);
          /* #swagger.responses[200] = {
            description: 'Returned equipments from type equipment id',
            schema: [{
                    $id: 1,
                    $gid: 1,
                    $name: 'equipment',
                    $ipAddress: 'ipAddress',
                    $release: 'release',
                    $brand: 'brand',
                    $canReceiveTextMessage: true,
                    camera: 'camera',
                    $status: 'status',
                    $equipmentTypeId: 1,
                    $behaviorId: 5,
                  }   ]
                } */
          res.status(StatusCodes.OK).json(equipments);
        } catch (err) {
          logger.error(
            "error while retrieving equipments from type equipment id! ",
            err
          );
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  return router;
};
