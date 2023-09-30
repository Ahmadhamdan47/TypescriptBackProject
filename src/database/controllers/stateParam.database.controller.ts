import express from "express";
import { Server } from "http";
import { logger } from "../../../logger";
import { StatusCodes } from "http-status-codes";
import { StateParamDatabaseInterface } from "../interfaces/stateParam.database";
import { StateParamDatabaseService } from "../services/stateParam.database.service";

export const stateParamDatabaseController = (server: Server) => {
  const service = new StateParamDatabaseService(server);

  const router = express.Router();
  router.use(express.json());

  router.get("/", (req, res) => {
    // #swagger.summary = 'get all states and params linked'
    (async () => {
      try {
        const stateId = req.query.stateId;
        /*  #swagger.parameters['stateId'] = {
          in: 'query',
          type: 'integer',
          description: 'state ID.' } */
        const paramId = req.query.paramId;
        /*  #swagger.parameters['paramId'] = {
          in: 'query',
          type: 'integer',
          description: 'param ID.' } */
        const statesParams = await service.retrieveAllStatesParams(
          stateId,
          paramId
        );
        /* #swagger.responses[200] = {
            description: 'Returned states ids and params ids linked',
            schema: [{
              $StateId: 1,
              $ParamId: 2,
            }      ]
          } */
        res.status(StatusCodes.OK).json(statesParams);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.post("/idsParams", (req, res) => {
    // #swagger.summary = 'get all params ids from states ids'
    (async () => {
      try {
        const ids = req.body;
        /*  #swagger.parameters['ids'] = {
          in: 'body',
          description: 'states ids',
          schema: [1, 2, 3]
        } */
        const paramsIds = await service.retrieveAllParamsIdsFromStatesIds(ids);
        /* #swagger.responses[200] = {
            description: 'Returned states ids from params ids',
            schema: [1,2]
        } */
        res.status(StatusCodes.OK).json(paramsIds);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.post("/", (req, res) => {
    // #swagger.summary = 'create a list of states ids and params ids linked'
    (async () => {
      try {
        const newStatesParams = req.body as StateParamDatabaseInterface[];
        /*  #swagger.parameters['NewStateParam'] = {
          in: 'body',
          description: 'state id and param id',
          schema: [{
            $StateId: 1,
            $ParamId: 1
          }]
        } */
        const statesParams = await service.createStatesParams(newStatesParams);
        /* #swagger.responses[201] = {
          description: 'Returned states ids and params ids linked',
          schema: [{
            $StateId: 1,
            $ParamId: 2,
          }      ]
        } */
        res.status(StatusCodes.CREATED).json(statesParams);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  return router;
};
