import express from "express";
import { Server } from "http";
import { logger } from "../../../logger";
import { StatusCodes } from "http-status-codes";
import { BehaviorPropertyDatabaseInterface } from "../interfaces/behaviorProperty.database";
import { BehaviorPropertyDatabaseService } from "../services/behaviorProperty.database.service";

export const behaviorPropertyDatabaseController = (server: Server) => {
  const service = new BehaviorPropertyDatabaseService(server);

  const router = express.Router();
  router.use(express.json());

  router.get("/", (req, res) => {
    // #swagger.summary = 'get all behaviors properties '
    (async () => {
      try {
        const behaviorsProperties =
          await service.retrieveAllBehaviorsProperties();
        /* #swagger.responses[200] = {
            description: 'Returned behaviors properties',
            schema: [{
              id: 1,
              equipmentPropertyId: 3,
              name: 'string',
            }      ]
          } */
        res.status(StatusCodes.OK).json(behaviorsProperties);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.get("/:id", (req, res) => {
    // #swagger.summary = 'get one behavior property by id '
    (async () => {
      try {
        const id = req.params.id;
        /*  #swagger.parameters['id'] = {
          in: 'path',
          type: 'integer',
          description: 'behavior property ID.' } */
        const behaviorProperty = await service.retrieveOneBehaviorProperty(id);
        /* #swagger.responses[200] = {
            description: 'Returned behavior property',
            schema: {
              $id: 1,
              $equipmentPropertyId: 3,
              $name: 'string',
            }
          } */
        res.status(StatusCodes.OK).json(behaviorProperty);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.post("/", (req, res) => {
    // #swagger.summary = 'create one or a list of behaviors properties'
    (async () => {
      try {
        // TODO : adapt to other swagger comments
        if (req.body instanceof Array) {
          res
            .status(StatusCodes.CREATED)
            .json(
              await service.createBehaviorsProperties(
                req.body as BehaviorPropertyDatabaseInterface[]
              )
            );
        } else {
          res
            .status(StatusCodes.CREATED)
            .json(
              await service.createOneBehaviorProperty(
                req.body as BehaviorPropertyDatabaseInterface
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
    // #swagger.summary = 'get all behaviors properties from ids'
    (async () => {
      try {
        const ids = req.body;
        /*  #swagger.parameters['ids'] = {
          in: 'body',
          description: 'behaviors properties ids',
          schema: {
            $ids: [1, 2, 3]
          }
        } */
        const behaviorsProperties =
          await service.retrieveAllBehaviorsPropertiesFromIds(ids);
        /* #swagger.responses[200] = {
            description: 'Returned behaviors properties from ids',
            schema: [{
              $id: 1,
              $equipmentPropertyId: 3,
              $name: 'string',
            }      ]
          } */
        res.status(StatusCodes.OK).json(behaviorsProperties);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.delete("/", (req, res) => {
    // #swagger.summary = 'delete all behaviors properties or from ids'
    (async () => {
      try {
        const ids = req.body;
        /*  #swagger.parameters['ids'] = {
          in: 'body',
          description: 'behaviors properties ids',
          schema: {
            ids: [1, 2, 3]
          }
        } */
        await service.deleteBehaviorsProperties(ids);
        res.sendStatus(StatusCodes.OK);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.delete("/propertiesIds", (req, res) => {
    // #swagger.summary = 'delete behaviors properties from states ids'
    (async () => {
      try {
        const ids = req.body;
        /*  #swagger.parameters['ids'] = {
          in: 'body',
          description: 'behaviors properties ids',
          schema: {
            $ids: [1, 2, 3]
          }
        } */
        await service.deleteBehaviorsPropertiesFromPropertiesIds(ids);
        res.sendStatus(StatusCodes.OK);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  return router;
};
