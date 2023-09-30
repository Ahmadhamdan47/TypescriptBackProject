import express from "express";
import { Server } from "http";
import { logger } from "../../../logger";
import { StatusCodes } from "http-status-codes";
import { EquipmentDatabaseInterface } from "../interfaces/equipment.database";
import { EquipmentDatabaseService } from "../services/equipment.database.service";

export const equipmentDatabaseController = (server: Server) => {
  const service = new EquipmentDatabaseService(server);

  const router = express.Router();
  router.use(express.json());

  router.get("/", (req, res) => {
    // #swagger.summary = 'get all equipments or equipments by systemId and/or status'
    (async () => {
      try {
        const systemId = req.query.systemId;
        /*  #swagger.parameters['systemId'] = {
          in: 'query',
          type: 'integer',
          description: 'system ID.' } */
        const status = req.query.status;
        /*  #swagger.parameters['status'] = {
          in: 'query',
          type: 'string',
          description: 'status.' } */
        const size = req.query.size;
        /*  #swagger.parameters['size'] = {
            in: 'query',
            type: 'integer',
            description: 'size.' } */
        const offset = req.query.offset;
        /*  #swagger.parameters['offset'] = {
              in: 'query',
              type: 'integer',
              description: 'offset.' } */
        const equipments = await service.retrieveAllEquipments(
          systemId,
          status,
          {
            size,
            offset,
          }
        );
        /* #swagger.responses[200] = {
          description: 'Returned equipments',
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
            $equipmentBrandId: 1,
            $behaviorId : 22
          }      ]
        } */
        res.status(StatusCodes.OK).json(equipments);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.get("/:id", (req, res) => {
    // #swagger.summary = 'get one equipment by id '
    (async () => {
      try {
        const id = req.params.id;
        /*  #swagger.parameters['id'] = {
            in: 'path',
            type: 'integer',
            description: 'equipment ID.' } */
        const equipment = await service.retrieveOneEquipment(id);
        /* #swagger.responses[200] = {
            description: 'Returned equipment',
            schema: {
              $id: 1,
              $gid: 1,
              $name: 'equipment',
              $ipAddress: 'ipAddress',
              $release: 'release',
              $brand: 'brand',
              $canReceiveTextMessage: true,
              camera: 'camera',
              $status: 'status',
              $equipmentBrandId: 1,
              $behaviorId : 22
            }
        } */
        res.status(StatusCodes.OK).json(equipment);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.post("/gids", (req, res) => {
    // #swagger.summary = 'get equipments linked by gids and system id '
    (async () => {
      try {
        const systemId = req.query.systemId;
        /*  #swagger.parameters['systemId'] = {
          in: 'query',
          type: 'integer',
          description: 'system ID.' } */
        const gids = req.body;
        /*  #swagger.parameters['gids'] = {
          in: 'body',
          description: 'gids',
          schema: [1, 2, 3]
        } */
        const equipments = await service.retrieveEquipmentsByGidsAndSystemId(
          gids,
          systemId
        );
        /* #swagger.responses[200] = {
            description: 'Returned equipments',
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
              $equipmentBrandId: 1,
              $behaviorId : 22
            }      ]
        } */
        res.status(StatusCodes.OK).json(equipments);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.get("/gid/:gid", (req, res) => {
    // #swagger.summary = 'get one equipment linked by gid and system id '
    (async () => {
      try {
        const gid = req.params.gid;
        /*  #swagger.parameters['gid'] = {
            in: 'path',
            type: 'integer',
            description: 'equipment GID.' } */
        const systemId = req.query.systemId;
        /*  #swagger.parameters['systemId'] = {
          in: 'query',
          type: 'integer',
          description: 'system ID.' } */
        const equipment = await service.retrieveOneEquipmentByGidAndSystemId(
          gid,
          systemId
        );
        /* #swagger.responses[200] = {
            description: 'Returned equipment',
            schema: {
              $id: 1,
              $gid: 1,
              $name: 'equipment',
              $ipAddress: 'ipAddress',
              $release: 'release',
              $brand: 'brand',
              $canReceiveTextMessage: true,
              camera: 'camera',
              $status: 'status',
              $equipmentBrandId: 1,
              $behaviorId : 22
            }
        } */
        res.status(StatusCodes.OK).json(equipment);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.post("/", (req, res) => {
    // #swagger.summary = 'create one or a list of equipments'
    (async () => {
      try {
        // TODO: swagger like other controllers
        if (req.body instanceof Array) {
          res
            .status(StatusCodes.CREATED)
            .json(
              await service.createEquipments(
                req.body as EquipmentDatabaseInterface[]
              )
            );
        } else {
          res
            .status(StatusCodes.CREATED)
            .json(
              await service.createOneEquipment(
                req.body as EquipmentDatabaseInterface
              )
            );
        }
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.post("/filter", (req, res) => {
    // #swagger.summary = 'get list of equipments from filters'
    (async () => {
      try {
        const size = req.query.size;
        /*  #swagger.parameters['size'] = {
            in: 'query',
            type: 'integer',
            description: 'size.' } */
        const offset = req.query.offset;
        /*  #swagger.parameters['offset'] = {
              in: 'query',
              type: 'integer',
              description: 'offset.' } */
        const filters = req.body;
        /*  #swagger.parameters['filters'] = {
          in: 'body',
          description: 'filters',
          schema: {
            typesIds: [1],
            ids: [2],
            name: 'string',
            canReceiveTextMessage: false,
            domainId: 1,
            systemId: 2
          }
        } */
        const equipments = await service.retrieveEquipmentsByFilters(filters, {
          size,
          offset,
        });
        res.status(StatusCodes.OK).json(equipments);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.put("/:id", (req, res) => {
    // #swagger.summary = 'update an equipment'
    (async () => {
      try {
        const id = req.params.id;
        /*  #swagger.parameters['id'] = {
            in: 'path',
            type: 'integer',
            description: 'equipment ID.' } */
        const parameters = req.body;
        /*  #swagger.parameters['parameters'] = {
          in: 'body',
          description: 'parameters',
          schema: {
            gid: 1,
            name: 'equipment',
            ipAddress: 'ipAddress',
            release: 'release',
            brand: 'brand',
            canReceiveTextMessage: true,
            camera: 'camera',
            status: 'status',
            equipmentBrandId: 1,
            behaviorId : 22
          }
        } */
        await service.updateEquipment(id, parameters);
        res.sendStatus(StatusCodes.OK);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.put("/", (req, res) => {
    // #swagger.summary = 'update equipments'
    (async () => {
      try {
        const parameters = req.body;
        /*  #swagger.parameters['parameters'] = {
          in: 'body',
          description: 'parameters',
          schema: {
            $equipmentsIds: [1, 2, 3],
            gid: 1,
            name: 'equipment',
            ipAddress: 'ipAddress',
            release: 'release',
            brand: 'brand',
            canReceiveTextMessage: true,
            camera: 'camera',
            status: 'status',
            equipmentBrandId: 1,
            behaviorId : 22
          }
        } */
        await service.updateEquipments(parameters);
        res.sendStatus(StatusCodes.OK);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.delete("/", (req, res) => {
    // #swagger.summary = 'delete all equipments or equipment with gid'
    (async () => {
      try {
        const gid = req.query.gid;
        /*  #swagger.parameters['gid'] = {
          in: 'query',
          type: 'integer',
          description: 'equipment GID.' } */
        await service.deleteAllEquipments(gid);
        res.sendStatus(StatusCodes.OK);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.delete("/:id", (req, res) => {
    // #swagger.summary = 'delete one equipment by id '
    (async () => {
      try {
        const id = req.params.id;
        /*  #swagger.parameters['id'] = {
            in: 'path',
            type: 'integer',
            description: 'equipment ID.' } */
        await service.deleteOneEquipment(id);
        res.sendStatus(StatusCodes.OK);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });
  return router;
};
