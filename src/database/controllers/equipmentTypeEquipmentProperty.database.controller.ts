import express from "express";
import { Server } from "http";
import { logger } from "../../../logger";
import { StatusCodes } from "http-status-codes";
import { EquipmentTypeEquipmentPropertyDatabaseInterface } from "../interfaces/equipmentTypeEquipmentProperty.database";
import { EquipmentTypeEquipmentPropertyDatabaseService } from "../services/equipmentTypeEquipmentProperty.database.service";

export const equipmentTypeEquipmentPropertyDatabaseController = (
  server: Server
) => {
  const service = new EquipmentTypeEquipmentPropertyDatabaseService(server);

  const router = express.Router();
  router.use(express.json());

  router.get("/", (req, res) => {
    // #swagger.summary = 'get all equipment types and equipments properties linked'
    (async () => {
      try {
        const equipmentTypeId = req.query.equipmentTypeId;
        /*  #swagger.parameters['equipmentTypeId'] = {
          in: 'query',
          type: 'integer',
          description: 'equipment type ID.' } */
        const equipmentPropertyId = req.query.equipmentPropertyId;
        /*  #swagger.parameters['equipmentPropertyId'] = {
          in: 'query',
          type: 'integer',
          description: 'equipment property ID.' } */
        const equipmentsTypes =
          await service.retrieveAllEquipmentsTypesEquipmentProperties(
            equipmentTypeId,
            equipmentPropertyId
          );
        /* #swagger.responses[200] = {
            description: 'Returned equipments properties ids and equipment types ids linked',
            schema: [{
              EquipmentPropertyId: 1,
              EquipmentTypeId: 2,
            }      ]
          } */
        res.status(StatusCodes.OK).json(equipmentsTypes);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.post("/equipmentsPropertiesIds", (req, res) => {
    // #swagger.summary = 'get all ids equipments properties from ids equipment types'
    (async () => {
      try {
        const ids = req.body;
        /*  #swagger.parameters['ids'] = {
          in: 'body',
          description: 'equipment types ids',
          schema: [1, 2, 3]
        } */
        const equipmentsPropertiesIds =
          await service.retrieveAllEquipmentPropertiesIdsFromEquipmentsTypesIds(
            ids
          );
        /* #swagger.responses[200] = {
            description: 'Returned equipments properties ids and equipment types ids linked',
            schema: [1,2]
        } */
        res.status(StatusCodes.OK).json(equipmentsPropertiesIds);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.post("/", (req, res) => {
    // #swagger.summary = 'create a list of equipments properties ids and equipment types ids linked'
    (async () => {
      try {
        const newEquipmentsTypes: EquipmentTypeEquipmentPropertyDatabaseInterface[] =
          req.body;
        /*  #swagger.parameters['equipmentsTypes'] = {
          in: 'body',
          description: 'equipments properties ids and equipment types ids linked',
          schema: [{
            $EquipmentPropertyId: 1,
            $EquipmentTypeId: 2,
          }       ]
        } */
        const equipmentsTypes =
          await service.createEquipmentsTypesEquipmentProperties(
            newEquipmentsTypes
          );
        /* #swagger.responses[200] = {
            description: 'Returned equipments properties ids and equipment types ids linked',
            schema: [{
              $EquipmentPropertyId: 1,
              $EquipmentTypeId: 2,
            }      ]
          } */
        res.status(StatusCodes.CREATED).json(equipmentsTypes);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  return router;
};
