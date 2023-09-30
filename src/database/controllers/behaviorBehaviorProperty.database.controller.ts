import express from "express";
import { Server } from "http";
import { logger } from "../../../logger";
import { StatusCodes } from "http-status-codes";
import { BehaviorBehaviorPropertyDatabaseInterface } from "../interfaces/behaviorBehaviorProperty.database";
import { BehaviorBehaviorPropertyDatabaseService } from "../services/behaviorBehaviorProperty.database.service";

export const behaviorBehaviorPropertyDatabaseController = (server: Server) => {
  const service = new BehaviorBehaviorPropertyDatabaseService(server);

  const router = express.Router();
  router.use(express.json());

  router.get("/", (req, res) => {
    // #swagger.summary = 'get all behaviors and behaviors properties linked'
    (async () => {
      try {
        const behaviorId = req.query.behaviorId;
        /*  #swagger.parameters['behaviorId'] = {
          in: 'query',
          type: 'integer',
          description: 'behavior ID.' } */
        const behaviorPropertyId = req.query.behaviorPropertyId;
        /*  #swagger.parameters['behaviorPropertyId'] = {
          in: 'query',
          type: 'integer',
          description: 'behavior property ID.' } */
        const behaviorBehaviorProperty =
          await service.retrieveAllBehaviorsBehaviorsProperties(
            behaviorId,
            behaviorPropertyId
          );
        /* #swagger.responses[200] = {
            description: 'Returned behaviors ids and behaviors properties ids linked',
            schema: [{
                $BehaviorId: 1,
                $BehaviorPropertyId: 2,
            }      ]
        } */
        res.status(StatusCodes.OK).json(behaviorBehaviorProperty);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.post("/idsBehaviorsProperties", (req, res) => {
    // #swagger.summary = 'get all behaviors properties ids from behaviors ids'
    (async () => {
      try {
        const ids = req.body;
        /*  #swagger.parameters['ids'] = {
          in: 'body',
          description: 'behaviors ids',
          schema: {
            $BehaviorIds: [1, 2, 3]
          }
        } */
        const behaviorsPropertiesIds =
          await service.retrieveAllBehaviorsPropertiesIdsFromBehaviorsIds(ids);
        /* #swagger.responses[200] = {
            description: 'Returned behaviors ids and behaviors properties ids linked',
            schema: [{
                $BehaviorId: 1,
                $BehaviorPropertyId: 2,
            }      ]
        } */
        res.status(StatusCodes.OK).json(behaviorsPropertiesIds);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.post("/", (req, res) => {
    // #swagger.summary = 'create a list of behaviors properties ids and behaviors ids linked'
    (async () => {
      try {
        const newBehaviorsBehaviorsProperties: BehaviorBehaviorPropertyDatabaseInterface[] =
          req.body;
        /*  #swagger.parameters['behaviorsBehaviorsProperties'] = {
          in: 'body',
          description: 'behaviors properties ids and behaviors ids linked',
          schema: [{
            $BehaviorId: 1,
            $BehaviorPropertyId: 2,
          }]
        } */
        const behaviorsBehaviorsProperties =
          await service.createBehaviorsBehaviorsProperties(
            newBehaviorsBehaviorsProperties
          );
        /* #swagger.responses[201] = {
            description: 'Returned behaviors properties ids and behaviors ids linked',
            schema: [{
                $BehaviorId: 1,
                $BehaviorPropertyId: 2,
            }      ]
        } */
        res.status(StatusCodes.CREATED).json(behaviorsBehaviorsProperties);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  return router;
};
