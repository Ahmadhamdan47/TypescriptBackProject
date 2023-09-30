import express from "express";
import { Server } from "http";
import { logger } from "../../../logger";
import { StatusCodes } from "http-status-codes";
import { ActionTypeParamDatabaseInterface } from "../interfaces/actionTypeParam.database";
import { ActionTypeParamDatabaseService } from "../services/actionTypeParam.database.service";

export const actionTypeParamDatabaseController = (server: Server) => {
  const service = new ActionTypeParamDatabaseService(server);

  const router = express.Router();
  router.use(express.json());

  router.get("/", (req, res) => {
    // #swagger.summary = 'get all action types and params linked'
    (async () => {
      try {
        const actionTypeId = req.query.actionTypeId;
        /*  #swagger.parameters['actionTypeId'] = {
          in: 'query',
          type: 'integer',
          description: 'action type ID.' } */
        const paramId = req.query.paramId;
        /*  #swagger.parameters['paramId'] = {
          in: 'query',
          type: 'integer',
          description: 'param ID.' } */
        const actionTypeParam = await service.retrieveAllActionsTypesParams(
          actionTypeId,
          paramId
        );
        /* #swagger.responses[200] = {
            description: 'Returned action types ids and params ids linked',
            schema: [{
                $ActionTypeId: 1,
                $ParamId: 2,
            }      ]
        } */
        res.status(StatusCodes.OK).json(actionTypeParam);
        /* #swagger.responses[200] = {
                description: 'Returned action types ids and params ids linked',
                schema: [{
                    ActionTypeId: 1,
                    ParamId: 2,
                }      ]
        } */
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.post("/idsParams", (req, res) => {
    // #swagger.summary = 'get all params ids from ids action types'
    (async () => {
      try {
        const actionTypeIds = req.body;
        /*  #swagger.parameters['actionTypeIds'] = {
          in: 'body',
          description: 'action types ids',
          schema: [1, 2, 3]
        } */
        const actionTypeParam =
          await service.retrieveAllParamsIdsFromActionsTypesIds(actionTypeIds);
        /* #swagger.responses[200] = {
            description: 'Returned action types ids and params ids linked',
            schema: [{
                $ActionTypeId: 1,
                $ParamId: 2,
            }      ]
        } */
        res.status(StatusCodes.OK).json(actionTypeParam);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.post("/", (req, res) => {
    // #swagger.summary = 'create a list of action types ids and params ids linked'
    (async () => {
      try {
        const newActionTypeParam: ActionTypeParamDatabaseInterface[] = req.body;
        /*  #swagger.parameters['actionTypeParam'] = {
          in: 'body',
          description: 'action types ids and params ids linked',
          schema: [{
            $ActionTypeId: 'integer',
            $ParamId: 'integer'
          }]
        } */
        const actionTypeParam = await service.createActionsTypesParams(
          newActionTypeParam
        );
        /* #swagger.responses[200] = {
            description: 'Returned action types ids and params ids linked',
            schema: [{
                $ActionTypeId: 1,
                $ParamId: 2,
            }      ]
        } */
        res.status(StatusCodes.CREATED).json(actionTypeParam);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  return router;
};
