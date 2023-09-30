import express from "express";
import { ActionUserServerService } from "../services/actionUser.server.service";
import {
  ActionUserDatabaseInterface,
  NewActionUser,
} from "../../database/interfaces/actionUser.database";
import { StatusCodes } from "http-status-codes";
import { Server } from "http";
import { ActionUserFilter } from "../interfaces/actionUserFilter";
import { logger } from "../../../logger";
import {
  permissionsConstants,
  requirePermissions,
} from "../middlewares/permissions.server.middleware";

export const actionUserServerController = (server: Server) => {
  const service = new ActionUserServerService(server);

  const router = express.Router();
  router.use(express.json());

  router.post("/", (req, res) => {
    // #swagger.summary = 'create news action user'
    (async () => {
      try {
        const newActionUser = req.body as NewActionUser;
        /*  #swagger.parameters['actionUser'] = {
                in: 'body',
                description: 'new action user object',
                schema: {
                      $action: 'string',
                      $timestamp: 'string',
                      $category: 'string',
                      $settings: ['string']
                }
        } */
        const actionUser = await service.insertActionUser(newActionUser);
        //TODO Ahmad or someone else, please check this
        /* #swagger.responses[200] = {
                description: 'the id of the created user',
                schema: { 
                    id: 1 
                }      
        } */
        res.status(StatusCodes.CREATED).json(actionUser);
      } catch (err) {
        logger.error("error while creating action user! ", err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.post(
    "/filter",
    requirePermissions(permissionsConstants.ACTION_USER.READ),
    (req, res) => {
      // #swagger.summary = 'get action user by filter '
      const filters: ActionUserFilter = req.body;
      /*  #swagger.parameters['filters'] = {
                in: 'body',
                description: 'filter action user by keyword and period',
                schema: {
                      $period: ['string'],
                      $keyword: 'string'
                }
        } */
      (async () => {
        try {
          const actionUsers: ActionUserDatabaseInterface[] =
            await service.getActionUsersByFilter(filters);
          res.status(StatusCodes.OK).json(actionUsers);
          //TODO Ahmad or someone else, please check this
          /* #swagger.responses[200] = {
                description: 'the id of the created user',
                schema: { 
                    $id: 1,
                    $action: 'string',
                    $timestamp: 'string',
                    $category: 'string',
                    $settings: ['settings']
                }      
        } */
        } catch (err) {
          logger.error("error while retrieving action user by filter! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  return router;
};
