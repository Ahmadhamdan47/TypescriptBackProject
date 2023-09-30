import express from "express";
import { Server } from "http";
import { logger } from "../../../logger";
import { StatusCodes } from "http-status-codes";
import { BehaviorStateDatabaseInterface } from "../interfaces/behaviorState.database";
import { BehaviorStateDatabaseService } from "../services/behaviorState.database.service";

export const behaviorStateDatabaseController = (server: Server) => {
  const service = new BehaviorStateDatabaseService(server);

  const router = express.Router();
  router.use(express.json());

  router.get("/", (req, res) => {
    // #swagger.summary = 'get all behaviors states '
    (async () => {
      try {
        const behaviorPropertyId = req.query.behaviorPropertyId;
        /*  #swagger.parameters['behaviorPropertyId'] = {
          in: 'query',  
          type: 'integer',
          description: 'behavior property ID.' } */
        const state = req.query.state;
        /*  #swagger.parameters['state'] = {
          in: 'query',
          type: 'string',
          description: 'state.' } */
        const behaviorsStates = await service.retrieveAllBehaviorsStates(
          behaviorPropertyId,
          state
        );
        /* #swagger.responses[200] = {
          description: 'Returned behaviors states',
          schema: [{
            $id: 1,
            $name: 'string',
            $stateId: 3,
            $icon: 'string',
            $alarm: true,
            $default: false,
            $mustBeArchived: false
          }      ]
        } */
        res.status(StatusCodes.OK).json(behaviorsStates);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.get("/:id", (req, res) => {
    // #swagger.summary = 'get one behavior state by id '
    (async () => {
      try {
        const id = req.params.id;
        /*  #swagger.parameters['id'] = {
          in: 'path',
          type: 'integer',
          description: 'behavior state ID.' } */
        const behaviorState = await service.retrieveOneBehaviorState(id);
        /* #swagger.responses[200] = {
          description: 'Returned behavior state',
          schema: {
            $id: 1,
            $name: 'string',
            $stateId: 3,
            $icon: 'string',
            $alarm: true,
            $default: false,
            $mustBeArchived: false
          }
        } */
        res.status(StatusCodes.OK).json(behaviorState);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.post("/", (req, res) => {
    // #swagger.summary = 'create one or a list of behaviors states'
    (async () => {
      try {
        if (req.body instanceof Array) {
          res
            .status(StatusCodes.CREATED)
            .json(
              await service.createBehaviorsStates(
                req.body as BehaviorStateDatabaseInterface[]
              )
            );
        } else {
          res
            .status(StatusCodes.CREATED)
            .json(
              await service.createOneBehaviorState(
                req.body as BehaviorStateDatabaseInterface
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
    // #swagger.summary = 'get all behaviors states from ids'
    (async () => {
      try {
        const ids = req.body;
        /*  #swagger.parameters['ids'] = {
          in: 'body',
          description: 'behaviors states ids',
          schema: {
            $BehaviorStateIds: [1, 2, 3]
          }
        } */
        const behaviorsStates = await service.retrieveAllBehaviorsStatesFromIds(
          ids
        );
        /* #swagger.responses[200] = {
          description: 'Returned behaviors states from ids',
          schema: [{
            id: 1,
            name: 'string',
            stateId: 3,
            icon: 'string',
            alarm: true,
            default: false,
            mustBeArchived: false,
          }      ]
        } */
        res.status(StatusCodes.OK).json(behaviorsStates);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.delete("/", (req, res) => {
    // #swagger.summary = 'delete all behaviors states or from ids'
    (async () => {
      try {
        const ids = req.body;
        /*  #swagger.parameters['ids'] = {
          in: 'body',
          description: 'behaviors states ids',
          schema: {
            $BehaviorStateIds: [1, 2, 3]
          }
        } */
        await service.deleteBehaviorsStates(ids);
        res.sendStatus(StatusCodes.OK);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.delete("/statesIds", (req, res) => {
    // #swagger.summary = 'delete behaviors states from states ids'
    (async () => {
      try {
        const ids = req.body;
        /*  #swagger.parameters['ids'] = {
          in: 'body',
          description: 'states ids',
          schema: {
            $StateIds: [1, 2, 3]
          }
        } */
        await service.deleteBehaviorsStatesFromStatesIds(ids);
        res.sendStatus(StatusCodes.OK);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  return router;
};
