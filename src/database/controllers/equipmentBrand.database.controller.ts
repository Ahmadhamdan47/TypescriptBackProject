import express from "express";
import { Server } from "http";
import { logger } from "../../../logger";
import { StatusCodes } from "http-status-codes";
import { EquipmentBrandDatabaseInterface } from "../interfaces/equipmentBrand.database";
import { EquipmentBrandDatabaseService } from "../services/equipmentBrand.database.service";

export const equipmentBrandDatabaseController = (server: Server) => {
  const service = new EquipmentBrandDatabaseService(server);

  const router = express.Router();
  router.use(express.json());

  router.get("/", (req, res) => {
    // #swagger.summary = 'get all equipments brands or get equipments brands from systemId'
    (async () => {
      try {
        const systemId = req.query.systemId;
        /*  #swagger.parameters['systemId'] = {
          in: 'query',
          type: 'integer',
          description: 'system ID.' } */
        const equipmentsBrands = await service.retrieveAllEquipmentsBrands(
          systemId
        );
        /* #swagger.responses[200] = {
          description: 'Returned equipments brands',
          schema: [{
            id: 1,
            name: 'string',
            equipmentTypeId: 1,
          }      ]
        } */
        res.status(StatusCodes.OK).json(equipmentsBrands);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.get("/ids", (req, res) => {
    // #swagger.summary = 'get all ids equipments brands from system id'
    (async () => {
      try {
        const systemId = req.query.systemId;
        /*  #swagger.parameters['systemId'] = {
          in: 'query',
          type: 'integer',
          description: 'system ID.' } */
        const equipmentsBrandsIds =
          await service.retrieveAllEquipmentsBrandsIdsFromSystemId(systemId);
        /* #swagger.responses[200] = {
          description: 'Returned equipments brands ids',
          schema: [1,2,3]
        } */
        res.status(StatusCodes.OK).json(equipmentsBrandsIds);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.get("/filterOne", (req, res) => {
    // #swagger.summary = 'get equipmentBrand from systemId and name'
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
          description: 'equipment brand name.' } */
        const equipmentBrand =
          await service.retrieveEquipmentBrandFromSystemIdAndName(
            systemId,
            name
          );
        /* #swagger.responses[200] = {
            description: 'Returned equipment brand',
            schema: {
              id: 1,
              name: 'string',
              equipmentTypeId: 1,
            }
          } */
        res.status(StatusCodes.OK).json(equipmentBrand);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.get("/:equipmentBrandId", (req, res) => {
    // #swagger.summary = 'get one equipment brand by its id'
    (async () => {
      try {
        const equipmentBrandId = req.params.equipmentBrandId;
        /*  #swagger.parameters['equipmentBrandId'] = {
          in: 'path',
          brand: 'integer',
          description: 'equipment brand ID.' } */
        const equipmentBrand = await service.retrieveOneEquipmentBrand(
          equipmentBrandId
        );
        /* #swagger.responses[200] = {
            description: 'Returned equipment brand',  
            schema: {
              $id: 1,
              $name: 'string',
              $equipmentTypeId: 1,
            }
          } */
        res.status(StatusCodes.OK).json(equipmentBrand);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.post("/", (req, res) => {
    // #swagger.summary = 'create one or a list of equipments brands'
    (async () => {
      try {
        // TODO : swagger like other controllers
        if (req.body instanceof Array) {
          const equipmentsBrands =
            req.body as EquipmentBrandDatabaseInterface[];
          res
            .status(StatusCodes.CREATED)
            .json(await service.createEquipmentsBrands(equipmentsBrands));
        } else {
          res
            .status(StatusCodes.CREATED)
            .json(
              await service.createOneEquipmentBrand(
                req.body as EquipmentBrandDatabaseInterface
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
    // #swagger.summary = 'get equipments brands from filters'
    (async () => {
      try {
        const ids = req.body as number[];
        /*  #swagger.parameters['ids'] = {
          in: 'body',
          description: 'equipments brands ids',
          schema: [1, 2, 3]
        } */
        const equipmentsBrands = await service.retrieveEquipmentsBrandsFromIds(
          ids
        );
        /* #swagger.responses[200] = {
          description: 'Returned equipments brands',
          schema: [{
            $id: 1,
            $name: 'string',
            $equipmentTypeId: 1,
          }]
        } */
        res.status(StatusCodes.OK).json(equipmentsBrands);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.delete("/", (req, res) => {
    // #swagger.summary = 'delete all equipments brands '
    (async () => {
      try {
        await service.deleteAllEquipmentsBrands();
        res.sendStatus(StatusCodes.OK);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.delete("/:id", (req, res) => {
    // #swagger.summary = 'delete one equipment brand by id '
    (async () => {
      try {
        const id = req.params.id;
        /*  #swagger.parameters['id'] = {
          in: 'path',
          type: 'integer',
          description: 'equipment brand ID.' } */
        await service.deleteOneEquipmentBrand(id);
        res.sendStatus(StatusCodes.OK);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });
  return router;
};
