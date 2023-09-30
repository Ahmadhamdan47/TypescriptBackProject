import express from "express";
import { Server } from "http";
import { logger } from "../../../logger";
import { StatusCodes } from "http-status-codes";
import { EquipmentFilter } from "../interfaces/equipmentsFilter";
import { EquipmentServerService } from "../services/equipment.server.service";
import { EquipmentEventServerInterface } from "../interfaces/equipment.server";
import {
  permissionsConstants,
  requirePermissions,
} from "../middlewares/permissions.server.middleware";

export const equipmentServerController = (server: Server) => {
  const service = new EquipmentServerService(server);

  const router = express.Router();
  router.use(express.json());

  router.get(
    "/",
    requirePermissions(permissionsConstants.EQUIPMENTS.READ),
    (req, res) => {
      // #swagger.summary = 'get all equipments'
      (async () => {
        try {
          const pagination = req.query;
          /*  #swagger.parameters['pagination'] = {
                in: 'query',
                description: 'pagination object',
                schema: {
                    page: 1,
                    size: 10,
                }
        } */
          const equipments = await service.getEquipments(pagination);
          /* #swagger.responses[200] = {
            description: 'Returned equipments with pagination',
            schema: {
              $totalItems: 152,
              $totalPages: 18,
              $currentPage: 3,
              $datas: [
                {
                  $id: 1,
                  $gid: 1,
                  $name: 'equipment',
                  $label: 'equipment',
                  $ipAddress: 'ipAddress',
                  $release: 'release',
                  camera: 'camera',
                  $status: 'status',
                  $canReceiveTextMessage: true,
                  $equipmentBrandId: 2,
                  $behaviorId: 1,
                  $domainId: 3,
                }
              ],
            }
          } */
          res.status(StatusCodes.OK).json(equipments);
        } catch (err) {
          logger.error("error while retrieving all equipments! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.get(
    "/actionsTypes",
    requirePermissions(permissionsConstants.EQUIPMENTS.READ),
    (req, res) => {
      // #swagger.summary = 'get action types from equipment brand id'
      (async () => {
        try {
          const equipmentBrandId = req.query.equipmentBrandId;
          /*  #swagger.parameters['equipmentBrandId'] = {
                in: 'query',
                type: 'integer',
                description: 'equipment brand ID.' } */
          const actionsTypes =
            await service.getActionsTypesFromEquipmentBrandId(equipmentBrandId);
          /* #swagger.responses[200] = {
              description: 'Returned action types from equipment brand and system id',
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
            "error while retrieving action types from equipment brand id! ",
            err
          );
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.get(
    "/states",
    requirePermissions(permissionsConstants.EQUIPMENTS.READ),
    (req, res) => {
      // #swagger.summary = 'get states from equipment brand id'
      (async () => {
        try {
          const equipmentBrandId = req.query.equipmentBrandId;
          /*  #swagger.parameters['equipmentBrandId'] = {
                in: 'query',
                type: 'integer',
                description: 'equipment brand ID.' } */
          const states = await service.getStatesFromEquipmentBrandId(
            equipmentBrandId
          );
          /* #swagger.responses[200] = {
            description: 'Returned states from equipment brand and system id',
            schema: [{
              $name: 'string',
              $icon: 'string',
              $gravity: 1,
              $concernedBrands: ['string'],
              $stateParams: [{
                $id: 1,
                $labelFr: 'string',
                $labelEn: 'string',
                $type: 'string',
                value: 'string',
              }]
            }      ]
          } */
          res.status(StatusCodes.OK).json(states);
        } catch (err) {
          logger.error(
            "error while retrieving states from equipment brand id! ",
            err
          );
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.post(
    "/filter",
    requirePermissions(permissionsConstants.EQUIPMENTS.READ),
    (req, res) => {
      // #swagger.summary = 'get equipments by filter'
      (async () => {
        try {
          const pagination = req.query;
          /*  #swagger.parameters['pagination'] = {
                  in: 'query',
                  description: 'pagination object',
                  schema: {
                      page: 1,
                      size: 10,
                  }
          } */
          const filters: EquipmentFilter = req.body;
          /*  #swagger.parameters['filters'] = {
                  in: 'body',
                  description: 'filter equipments by attributes',
                  schema: {
                      typesIds: [1, 2],
                      ids: [1, 2],
                      name: 'string',
                      canReceiveTextMessage: true,
                      domainId: 5,
                      systemId: 4,
                  }
          } */
          const equipments = await service.getEquipmentsByFilter(
            filters,
            pagination
          );
          /* #swagger.responses[200] = {
            description: 'Returned equipments with filter and pagination',
            schema: {
              $totalItems: 152,
              $datas: [
                {
                  $id: 1,
                  $gid: 1,
                  $name: 'equipment',
                  $label: 'equipment',
                  $ipAddress: 'ipAddress',
                  $release: 'release',
                  camera: 'camera',
                  $status: 'status',
                  $canReceiveTextMessage: true,
                  $equipmentBrandId: 2,
                  $behaviorId: 1,
                  $domainId: 3,
                }
              ],
              $totalPages: 18,
              $currentPage: 3,
            }
          } */
          res.status(StatusCodes.OK).json(equipments);
        } catch (error) {
          logger.error(
            "error while retrieving equipments with filters! ",
            error
          );
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.post(
    "/events",
    requirePermissions(permissionsConstants.EQUIPMENTS.UPDATE),
    (req, res) => {
      // #swagger.summary = 'subscribe or unsubscribe to receive events from equipments of systems'
      (async () => {
        try {
          const equipmentsEvents: EquipmentEventServerInterface[] = req.body;
          /*  #swagger.parameters['equipmentsEvents'] = {
                in: 'body',
                description: 'subscribe or unsubscribe to receive events from equipments of systems',
                schema: [{
                      $equipmentId: 1,
                      $subscribe: true
                }]
        } */
          await service.subscribeToEquipmentsEvents(equipmentsEvents);
          res.sendStatus(StatusCodes.OK);
        } catch (err) {
          logger.error("error while subscribing to equipments events! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.post(
    "/:id/actions/:actionType",
    requirePermissions(permissionsConstants.EQUIPMENTS.UPDATE),
    (req, res) => {
      // #swagger.summary = 'Operate an equipment to do an action in a system'
      (async () => {
        try {
          const id = req.params.id;
          /*  #swagger.parameters['id'] = {
                in: 'path',
                type: 'integer',
                description: 'equipment ID.' } */
          const actionType = req.params.actionType;
          /*  #swagger.parameters['actionType'] = {
                in: 'path',
                type: 'string',
                description: 'action type.' } */
          const params = req.body as Map<string, string>;
          /*  #swagger.parameters['params'] = {
                in: 'body',
                description: 'map of params to do an action',
                schema: {
                  param: 'string',
                }
        } */
          await service.operateEquipment(id, actionType, params);
          res.sendStatus(StatusCodes.OK);
        } catch (err) {
          logger.error(
            "error while operating an equipment to do an action in a system! ",
            err
          );
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.delete(
    "/:id",
    requirePermissions(permissionsConstants.EQUIPMENTS.DELETE),
    (req, res) => {
      // #swagger.summary = 'Delete an equipment (via id) and its linked datas'
      (async () => {
        try {
          const id = req.params.id;
          /*  #swagger.parameters['id'] = {
                in: 'path',
                type: 'integer',
                description: 'equipment ID.' } */
          // Delete with cascade an equipment, xtvisionEquipmentConfig and currentEquipmentState if exists in database
          await service.deleteEquipmentAndItsDatas(id);
          res.sendStatus(StatusCodes.OK);
        } catch (err) {
          logger.error("error while deleting equipment and its datas! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  return router;
};
