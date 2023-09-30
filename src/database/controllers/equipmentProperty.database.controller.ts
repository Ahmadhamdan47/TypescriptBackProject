import express from "express";
import { Server } from "http";
import { logger } from "../../../logger";
import { StatusCodes } from "http-status-codes";
import { EquipmentPropertyDatabaseInterface } from "../interfaces/equipmentProperty.database";
import { EquipmentPropertyDatabaseService } from "../services/equipmentProperty.database.service";

export const equipmentPropertyDatabaseController = (server: Server) => {
  const service = new EquipmentPropertyDatabaseService(server);

  const router = express.Router();
  router.use(express.json());

  router.get("/", (req, res) => {
    // #swagger.summary = 'get all equipment properties or equipments properties from equipmentTypeId '
    (async () => {
      try {
        const equipmentTypeId = req.query.equipmentTypeId;
        /*  #swagger.parameters['equipmentTypeId'] = {
          in: 'query',
          type: 'integer',
          description: 'equipment type ID.' } */
        const equipmentProperties = await service.retrieveEquipmentsProperties(
          equipmentTypeId
        );
        /* #swagger.responses[200] = {
          description: 'Returned equipment properties',
          schema: [{
            $id: 1,
            $name: 'string',
          }      ]
        } */
        res.status(StatusCodes.OK).json(equipmentProperties);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.get("/:id", (req, res) => {
    // #swagger.summary = 'get one equipment property by id '
    (async () => {
      try {
        const id = req.params.id;
        /*  #swagger.parameters['id'] = {
          in: 'path',
          type: 'integer',
          description: 'equipment property ID.' } */
        const equipmentProperty = await service.retrieveOneEquipmentProperty(
          req.params.id
        );
        /* #swagger.responses[200] = {
          description: 'Returned equipment property',
          schema: {
            $id: 1,
            $name: 'string',
          }
        } */
        res.status(StatusCodes.OK).json(equipmentProperty);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.post("/", (req, res) => {
    // #swagger.summary = 'create one or a list of equipment properties'
    (async () => {
      try {
        // TODO : like other swagger comments
        if (req.body instanceof Array) {
          const equipmentProperties =
            req.body as EquipmentPropertyDatabaseInterface[];
          res
            .status(StatusCodes.CREATED)
            .json(await service.createEquipmentProperties(equipmentProperties));
        } else {
          res
            .status(StatusCodes.CREATED)
            .json(
              await service.createOneEquipmentProperty(
                req.body as EquipmentPropertyDatabaseInterface
              )
            );
        }
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.delete("/", (req, res) => {
    // #swagger.summary = 'delete all equipment properties '
    (async () => {
      try {
        const ids = req.body;
        /*  #swagger.parameters['ids'] = {
          in: 'body',
          description: 'equipment properties ids',
          schema: {
            $ids:[1, 2, 3]
          }
        } */
        await service.deleteEquipmentPropertiesFromIds(ids);
        res.sendStatus(StatusCodes.OK);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.delete("/:id", (req, res) => {
    // #swagger.summary = 'delete one equipment property by id '
    (async () => {
      try {
        const id = req.params.id;
        /*  #swagger.parameters['id'] = {
          in: 'path',
          type: 'integer',
          description: 'equipment property ID.' } */
        await service.deleteOneEquipmentProperty(id);
        res.sendStatus(StatusCodes.OK);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });
  return router;
};
