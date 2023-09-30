import express from "express";
import { Server } from "http";
import { StatusCodes } from "http-status-codes";
import { SystemServerService } from "../services/system.server.service";
import { SystemFilter } from "../interfaces/systemsFilter";
import {
  AddSystemServerInterface,
  AuthMode,
} from "../interfaces/addSystem.server";
import { logger } from "../../../logger";
import {
  permissionsConstants,
  requirePermissions,
} from "../middlewares/permissions.server.middleware";
import { CASTELSUITE, RABBITMQ } from "../resources/constants";

export const systemServerController = (server: Server) => {
  const service = new SystemServerService(server);

  const router = express.Router();
  router.use(express.json());

  router.get(
    "/",
    requirePermissions(permissionsConstants.SYSTEMS.READ),
    (req, res) => {
      // #swagger.summary = 'get all systems'
      (async () => {
        try {
          const systems = await service.getSystems();
          res.status(StatusCodes.OK).json(systems);
          /* #swagger.responses[200] = {
                description: 'Returned systems',
                schema: [{
                    $id: 1,
                    $name: 'server',
                    $user: 'string',
                    $kind: 'type',
                    $brand: 'brand',
                    port : 'port',
                    $address: 'address',
                    $release: 'release',
                    $state: 'connected',
                    $createdBy: 'xtvision',
                    $createdAt : '01/01/2000',
                    $updatedBy : 'xtvision',
                    $updatedAt : '01/01/2000',
                }      ]
        } */
        } catch (err) {
          logger.error("error while retrieving systems! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.get(
    "/authModes",
    requirePermissions(permissionsConstants.SYSTEMS.READ),
    (req, res) => {
      // #swagger.summary = 'get authentication modes list for systems'
      (async () => {
        try {
          res.status(StatusCodes.OK).json(Object.values(AuthMode));
          /* #swagger.responses[200] = {
                description: 'Returned authentication modes list for systems',
                schema: ['string']
        } */
        } catch (err) {
          logger.error(
            "error while retrieving authentication modes list for systems! ",
            err
          );
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.get(
    "/brands",
    requirePermissions(permissionsConstants.SYSTEMS.READ),
    (req, res) => {
      // #swagger.summary = 'get brands list for systems'
      (async () => {
        try {
          res.status(StatusCodes.OK).json([CASTELSUITE, RABBITMQ]);
          /* #swagger.responses[200] = {
                description: 'Returned brands list for systems',
                schema: ['string']
        } */
        } catch (err) {
          logger.error("error while retrieving brands list for systems! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.get(
    "/:id",
    requirePermissions(permissionsConstants.SYSTEMS.READ),
    (req, res) => {
      // #swagger.summary = 'get specific system by id'
      (async () => {
        try {
          const system = await service.getSystem(req.params.id);
          res.status(StatusCodes.OK).json(system);
          /* #swagger.responses[200] = {
                description: 'Returned specific system by id',
                schema: [{
                    $id: 1,
                    $name: 'server',
                    $kind: 'type',
                    $brand: 'brand',
                    port : 'port',
                    $address: 'address',
                    $release: 'release',
                    $state: 'connected',
                    $createdBy: 'xtvision',
                    $createdAt : '01/01/2000',
                    $updatedBy : 'xtvision',
                    $updatedAt : '01/01/2000',
                }      ]
        } */
        } catch (err) {
          logger.error("error while retrieving specific system by id! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.post(
    "/filter",
    requirePermissions(permissionsConstants.SYSTEMS.READ),
    (req, res) => {
      // #swagger.summary = 'get systems by filter'
      (async () => {
        try {
          const filters: SystemFilter = req.body;
          /*  #swagger.parameters['filters'] = {
            in: 'body',
            description: 'filter systems by ...',
            schema: {
              kind: 'type',
              brand: 'brand',
            }
    } */
          const systems = await service.getSystemsByFilter(filters);
          res.status(StatusCodes.OK).json(systems);
          /* #swagger.responses[200] = {
                description: 'Returned filtered systems',
                schema: [{
                    $id: 1,
                    $name: 'server',
                    $kind: 'type',
                    $brand: 'brand',
                    port : 'port',
                    $address: 'address',
                    $release: 'release',
                    $state: 'connected',
                    $createdBy: 'xtvision',
                    $createdAt : '01/01/2000',
                    $updatedBy : 'xtvision',
                    $updatedAt : '01/01/2000',
                }      ]
        } */
        } catch (err) {
          logger.error("error while retrieving systems with filters! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.post(
    "/",
    requirePermissions(permissionsConstants.SYSTEMS.CREATE),
    (req, res) => {
      // #swagger.summary = 'add a system'
      (async () => {
        try {
          const addSystem: AddSystemServerInterface = req.body;
          /*  #swagger.parameters['addServer'] = {
                in: 'body',
                description: '',
                schema: {
                      $address: 'ip or dns',
                      $kind: 'kind',
                      $name: 'string',
                      port: 'port',
                      managementArea: 'managementArea',
                      category: 'category',
                      $brand: 'brand',
                      $createdBy: 'xtvision',
                      $authMode : 'string',
                      $user : 'string',
                      $password : 'string',
                }
        } */
          res
            .status(StatusCodes.OK)
            .json(await service.createSystem(addSystem));
          /* #swagger.responses[200] = {
                description: 'Returned system id and nb equipments',
                schema: [{
                    $id: 1,
                    $nbEquipments: 50,
                }      ]
        } */
        } catch (err) {
          logger.error("error while creating system! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.put(
    "/:id",
    requirePermissions(permissionsConstants.SYSTEMS.UPDATE),
    (req, res) => {
      // #swagger.summary = 'Update a system'
      (async () => {
        try {
          const id = req.params.id;
          /* #swagger.parameters['id'] = {
                in: 'path',
                type: 'integer',
                description: 'system ID.' } */
          const params = req.body;
          /*  #swagger.parameters['params'] = {
                in: 'body',
                description: 'attributes to update',
                schema: {
                      address: 'ip or dns',
                      kind: 'kind',
                      name: 'string',
                      port: 'port',
                      managementArea: 'managementArea',
                      category: 'category',
                      brand: 'brand',
                      createdBy: 'xtvision',
                      authMode : 'string',
                }
        } */
          await service.updateSystem(id, params);
          res.sendStatus(StatusCodes.OK);
        } catch (err) {
          logger.error("error while updating system! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.delete(
    "/",
    requirePermissions(permissionsConstants.SYSTEMS.DELETE),
    (req, res) => {
      // #swagger.summary = 'Delete all systems and their linked datas'
      (async () => {
        try {
          // Delete with cascade systems, equipments, xtvision equipment configs, equipment types, action types, states,
          // params, behaviors, behaviors properties and behaviors states with foreigns keys and tables linked in database
          await service.deleteSystemsInDBAndTheirDatas();
          res.sendStatus(StatusCodes.OK);
        } catch (err) {
          logger.error(
            "error while deleting all systems and their linked datas! ",
            err
          );
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.delete(
    "/:id",
    requirePermissions(permissionsConstants.SYSTEMS.DELETE),
    (req, res) => {
      // #swagger.summary = 'Delete a system and its linked datas'
      (async () => {
        try {
          const id = req.params.id;
          /* #swagger.parameters['id'] = {
                in: 'path',
                type: 'integer',
                description: 'system ID.' } */
          // Delete with cascade system, equipments, xtvision equipment configs, equipment types, action types, states,
          // params, behaviors, behaviors properties and behaviors states with foreigns keys and tables linked in database
          await service.deleteSystemInDBAndItsDatas(id);
          res.sendStatus(StatusCodes.OK);
        } catch (err) {
          logger.error(
            "error while deleting system and its linked datas! ",
            err
          );
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.get(
    "/:id/equipments",
    requirePermissions(permissionsConstants.SYSTEMS.READ),
    (req, res) => {
      // #swagger.summary = 'get equipments from system id order by type'
      (async () => {
        try {
          const id = req.params.id;
          /* #swagger.parameters['id'] = {
                in: 'path',
                type: 'integer',
                description: 'system ID.' } */
          const equipments = await service.getEquipmentsFromSystemIdOrderByType(
            id
          );
          /* #swagger.responses[200] = {
            description: 'Returned equipments from system id order by type',
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
              $systemId: 1,
            }   ]
          } */
          res.status(StatusCodes.OK).json(equipments);
        } catch (err) {
          logger.error(
            "error while retrieving equipments from system id! ",
            err
          );
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.get(
    "/:id/equipmentsTypes",
    requirePermissions(permissionsConstants.SYSTEMS.READ),
    (req, res) => {
      // #swagger.summary = 'get equipment types from system id'
      (async () => {
        try {
          const id = req.params.id;
          /* #swagger.parameters['id'] = {
                in: 'path',
                type: 'integer',
                description: 'system ID.' } */
          const equipmentsTypes = await service.getEquipmentsTypesFromSystemId(
            id
          );
          /* #swagger.responses[200] = {
            description: 'Returned equipment types from system id',
            schema: [{
              $id: 1,
              $name: 'string',
              $systemId: 7
            }   ]
          } */
          res.status(StatusCodes.OK).json(equipmentsTypes);
        } catch (err) {
          logger.error(
            "error while retrieving equipment types from system id! "
          );
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.post(
    "/subscribe",
    requirePermissions(permissionsConstants.SYSTEMS.UPDATE),
    (req, res) => {
      // #swagger.summary = 'Reconnect systems and init Web Socket connection to systems if they exist (to get events)'
      (async () => {
        try {
          await service.reconnectToSystems();
          res.sendStatus(StatusCodes.OK);
        } catch (err) {
          logger.error("error while reconnecting to systems! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  return router;
};
