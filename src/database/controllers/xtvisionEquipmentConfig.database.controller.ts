import express from "express";
import { Server } from "http";
import { logger } from "../../../logger";
import { StatusCodes } from "http-status-codes";
import { XtvisionEquipmentConfigDatabaseInterface } from "../interfaces/xtvisionEquipmentConfig.database";
import { XtvisionEquipmentConfigDatabaseService } from "../services/xtvisionEquipmentConfig.database.service";
import { XtvisionEquipmentConfig } from "../models/xtvisionEquipmentConfig.model";

export const xtvisionEquipmentConfigDatabaseController = (server: Server) => {
  const service = new XtvisionEquipmentConfigDatabaseService(server);

  const router = express.Router();
  router.use(express.json());

  router.get("/", (req, res) => {
    // #swagger.summary = 'get all xtvision equipment configs '
    (async () => {
      try {
        const xtvisionEquipmentConfigs =
          await service.retrieveAllXtvisionEquipmentConfigs();
        /* #swagger.responses[200] = {
            description: 'Returned xtvision equipment configs',
            schema: [{
              $equipmentId: '1',
              $isSupervised: false,
            }      ]
          } */
        res.status(StatusCodes.OK).json(xtvisionEquipmentConfigs);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.get("/:id", (req, res) => {
    // #swagger.summary = 'get one xtvision equipment config by id '
    (async () => {
      try {
        const id = req.params.id;
        /*  #swagger.parameters['id'] = {
            in: 'path',
            type: 'integer',
            description: 'xtvision equipment config ID.' } */
        const xtvisionEquipmentConfig =
          await service.retrieveOneXtvisionEquipmentConfig(id);
        /* #swagger.responses[200] = {
            description: 'Returned xtvision equipment config',
            schema: {
              $equipmentId: '1',
              $isSupervised: false,
            }
          } */
        res.status(StatusCodes.OK).json(xtvisionEquipmentConfig);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.post("/", (req, res) => {
    // #swagger.summary = 'create one or a list of xtvision equipment configs'
    (async () => {
      try {
        // TODO : like other swagger comments
        if (req.body instanceof Array) {
          res
            .status(StatusCodes.CREATED)
            .json(
              await service.createXtvisionEquipmentConfigs(
                req.body as XtvisionEquipmentConfigDatabaseInterface[]
              )
            );
        } else {
          res
            .status(StatusCodes.CREATED)
            .json(
              await service.createOneXtvisionEquipmentConfig(
                req.body as XtvisionEquipmentConfigDatabaseInterface
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
    // #swagger.summary = 'get all xtvision equipment configs from ids'
    (async () => {
      try {
        const ids = req.body;
        /*  #swagger.parameters['ids'] = {
                in: 'body',
                description: 'xtvision equipment configs ids',
                schema: [1, 2, 3]
        } */
        const xtvisionEquipmentConfigs =
          await service.retrieveAllXtvisionEquipmentConfigsFromIds(ids);
        /* #swagger.responses[200] = {
            description: 'Returned xtvision equipment configs from ids',
            schema: [{
              $equipmentId: '1',
              $isSupervised: false,
            }      ]
          } */
        res.status(StatusCodes.OK).json(xtvisionEquipmentConfigs);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.put("/:id", (req, res) => {
    // #swagger.summary = 'update xtvision equipment config'
    (async () => {
      try {
        const id = req.params.id;
        /*  #swagger.parameters['id'] = {
            in: 'path',
            type: 'integer',
            description: 'xtvision equipment config ID.' } */
        const parameters = req.body;
        /*  #swagger.parameters['parameters'] = {
            in: 'body',
            description: 'xtvision equipment config parameters',
            schema: {
              $equipmentId: '1',
              $isSupervised: false,
            }
          } */
        await service.updateXtvisionEquipmentConfig(id, parameters);
        res.sendStatus(StatusCodes.OK);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.put("/", (req, res) => {
    // #swagger.summary = 'update xtvision equipments configs'
    (async () => {
      try {
        const parameters = req.body;
        /*  #swagger.parameters['parameters'] = {
            in: 'body',
            description: 'xtvision equipments configs parameters',
            schema: [{
              $equipmentId: '1',
              $isSupervised: false,
            }]
          } */
        await service.updateXtvisionEquipmentsConfigs(parameters);
        res.sendStatus(StatusCodes.OK);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.delete("/", (req, res) => {
    // #swagger.summary = 'delete xtvision equipment configs from ids'
    (async () => {
      try {
        const ids = req.body;
        /*  #swagger.parameters['ids'] = {
                in: 'body',
                description: 'xtvision equipment configs ids',
                schema: [1, 2, 3]
        } */
        await service.deleteXtvisionEquipmentConfigsFromIds(ids);
        res.sendStatus(StatusCodes.OK);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  return router;
};
