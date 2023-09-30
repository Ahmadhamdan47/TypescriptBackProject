import express from "express";
import { Server } from "http";
import { logger } from "../../../logger";
import { StatusCodes } from "http-status-codes";
import { EquipmentTypeDatabaseInterface } from "../interfaces/equipmentType.database";
import { EquipmentTypeDatabaseService } from "../services/equipmentType.database.service";

export const equipmentTypeDatabaseController = (server: Server) => {
  const service = new EquipmentTypeDatabaseService(server);

  const router = express.Router();
  router.use(express.json());

  router.get("/", (req, res) => {
    // #swagger.summary = 'get all equipment types or equipment types from systemId'
    (async () => {
      try {
        const systemId = req.query.systemId;
        /*  #swagger.parameters['systemId'] = {
          in: 'query',
          type: 'integer',
          description: 'system ID.' } */
        const equipmentsTypes = await service.retrieveAllEquipmentsTypes(
          systemId
        );
        /* #swagger.responses[200] = {
          description: 'Returned equipment types',
          schema: [{
            id: 1,
            name: 'string',
            systemId: 1,
          }      ]
        } */
        res.status(StatusCodes.OK).json(equipmentsTypes);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.get("/ids", (req, res) => {
    // #swagger.summary = 'get all ids equipment types from system id'
    (async () => {
      try {
        const systemId = req.query.systemId;
        /*  #swagger.parameters['systemId'] = {
          in: 'query',
          type: 'integer',
          description: 'system ID.' } */
        const equipmentsTypesIds =
          await service.retrieveAllEquipmentsTypesIdsFromSystemId(systemId);
        /* #swagger.responses[200] = {
          description: 'Returned equipment types ids',
          schema: [1,2,3]
        } */
        res.status(StatusCodes.OK).json(equipmentsTypesIds);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.get("/filterOne", (req, res) => {
    // #swagger.summary = 'get equipmentType from systemId and name'
    (async () => {
      try {
        const systemId = req.query.systemId;
        /*  #swagger.parameters['systemId'] = {
          in: 'query',
          type: 'integer',
          description: 'system ID.' } */
        const name = req.query.name;
        /*  #swagger.parameters['name'] = {
          in: 'query',
          type: 'string',
          description: 'name.' } */
        const equipmentType =
          await service.retrieveEquipmentTypeFromSystemIdAndName(
            systemId,
            name
          );
        /* #swagger.responses[200] = {
            description: 'Returned type equipment',
            schema: {
              id: 1,
              name: 'string',
              systemId: 1,
            }
          } */
        res.status(StatusCodes.OK).json(equipmentType);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.get("/:id", (req, res) => {
    // #swagger.summary = 'get one type equipment by id '
    (async () => {
      try {
        const id = req.params.id;
        /*  #swagger.parameters['id'] = {
          in: 'path',
          type: 'integer',
          description: 'type equipment ID.' } */
        const equipmentType = await service.retrieveOneEquipmentType(id);
        /* #swagger.responses[200] = {
            description: 'Returned type equipment',
            schema: {
              $id: 1,
              $name: 'string',
              $systemId: 1,
            }
          } */
        res.status(StatusCodes.OK).json(equipmentType);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.post("/", (req, res) => {
    // #swagger.summary = 'create one or a list of equipment types'
    (async () => {
      try {
        // TODO : like other swagger comments
        if (req.body instanceof Array) {
          const equipmentsTypes = req.body as EquipmentTypeDatabaseInterface[];
          res
            .status(StatusCodes.CREATED)
            .json(await service.createEquipmentsTypes(equipmentsTypes));
        } else {
          res
            .status(StatusCodes.CREATED)
            .json(
              await service.createOneEquipmentType(
                req.body as EquipmentTypeDatabaseInterface
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
    // #swagger.summary = 'get equipment types from equipment types ids'
    (async () => {
      try {
        const ids: number[] = req.body;
        /*  #swagger.parameters['ids'] = {
          in: 'body',
          description: 'equipment types ids',
          schema: [1, 2, 3]
        } */
        const equipmentsTypes = await service.retrieveEquipmentsTypesFromIds(
          ids
        );
        /* #swagger.responses[200] = {
          description: 'Returned equipment types',
          schema: [{
            $id: 1,
            $name: 'string',
            $systemId: 1,
          }]
        } */
        res.status(StatusCodes.OK).json(equipmentsTypes);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  return router;
};
