import express from "express";
import { Server } from "http";
import { StatusCodes } from "http-status-codes";
import { logger } from "../../../logger";
import { BehaviorDatabaseInterface } from "../interfaces/behavior.database";
import { BehaviorDatabaseService } from "../services/behavior.database.service";

export const behaviorDatabaseController = (server: Server) => {
  const service = new BehaviorDatabaseService(server);

  const router = express.Router();
  router.use(express.json());

  router.get("/", (req, res) => {
    // #swagger.summary = 'get all behaviors '
    (async () => {
      try {
        const behaviors = await service.retrieveAllBehaviors();
        /* #swagger.responses[200] = {
          description: 'Returned behaviors',
          schema: [{
            id: 1,
            name: 'string',
            icon: 'icon.jpg',
            equipmentTypeId: 1,
            isDefault: true
          }      ]
        } */
        res.status(StatusCodes.OK).json(behaviors);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.get("/filterOne", (req, res) => {
    // #swagger.summary = 'get one default behavior by equipmentTypeId '
    (async () => {
      try {
        const equipmentTypeId = req.query.equipmentTypeId;
        /*  #swagger.parameters['equipmentTypeId'] = {
          in: 'query',
          type: 'integer',
          description: 'equipment type ID.' } */
        const defaultBehavior =
          await service.retrieveDefaultBehaviorFromEquipmentTypeId(
            equipmentTypeId
          );
        /* #swagger.responses[200] = {
            description: 'Returned default behavior',
            schema: {
              $id: 1,
              $name: 'string',
              $icon: 'icon.jpg',
              $isDefault: true
            }
          } */
        res.status(StatusCodes.OK).json(defaultBehavior);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.get("/:id", (req, res) => {
    // #swagger.summary = 'get one behavior by id '
    (async () => {
      try {
        const id = req.params.id;
        /*  #swagger.parameters['id'] = {
          in: 'path',
          type: 'integer',
          description: 'behavior ID.' } */
        const behavior = await service.retrieveOneBehavior(id);
        /* #swagger.responses[200] = {
            description: 'Returned behavior',
            schema: {
              $id: 1,
              $name: 'string',
              $icon: 'icon.jpg',
              $isDefault: true
            }
          } */
        res.status(StatusCodes.OK).json(behavior);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.post("/", (req, res) => {
    // #swagger.summary = 'create one or a list of behaviors'
    (async () => {
      try {
        // TODO : adapt to other swagger comments
        if (req.body instanceof Array) {
          res
            .status(StatusCodes.CREATED)
            .json(
              await service.createBehaviors(
                req.body as BehaviorDatabaseInterface[]
              )
            );
        } else {
          res
            .status(StatusCodes.CREATED)
            .json(
              await service.createOneBehavior(
                req.body as BehaviorDatabaseInterface
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
    // #swagger.summary = 'delete all behaviors or from ids'
    (async () => {
      try {
        const ids = req.body;
        /*  #swagger.parameters['ids'] = {
          in: 'body',
          description: 'behaviors ids',
          schema: {
            ids: [1, 2, 3]
          }
        } */
        await service.deleteAllBehaviors(ids);
        res.sendStatus(StatusCodes.OK);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.delete("/:id", (req, res) => {
    // #swagger.summary = 'delete one behavior by id '
    (async () => {
      try {
        const id = req.params.id;
        /*  #swagger.parameters['id'] = {
          in: 'path',
          type: 'integer',
          description: 'behavior ID.' } */
        await service.deleteOneBehavior(id);
        res.sendStatus(StatusCodes.OK);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });
  return router;
};
