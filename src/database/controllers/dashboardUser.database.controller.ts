import express from "express";
import { Server } from "http";
import { logger } from "../../../logger";
import { StatusCodes } from "http-status-codes";
import { DashboardUserDatabaseService } from "../services/dashboardUser.database.service";

export const dashboardUserDatabaseController = (server: Server) => {
  const service = new DashboardUserDatabaseService(server);

  const router = express.Router();
  router.use(express.json());

  router.get("/", (req, res) => {
    // #swagger.summary = 'get all dashboards and users linked'
    (async () => {
      try {
        const dashboardId = req.query.dashboardId;
        /*  #swagger.parameters['dashboardId'] = {
          in: 'query',
          type: 'integer',
          description: 'dashboard ID.' } */
        const userId = req.query.userId;
        /*  #swagger.parameters['userId'] = {
          in: 'query',
          type: 'integer',
          description: 'user ID.' } */
        const dashboards = await service.retrieveAllDashboardsUsers(
          dashboardId,
          userId
        );
        /* #swagger.responses[200] = {
            description: 'Returned dashboards ids and users ids linked',
            schema: [{
                $DashboardId: 1,
                $UserId: 2,
            }      ]
        } */
        res.status(StatusCodes.OK).json(dashboards);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.post("/usersIds", (req, res) => {
    // #swagger.summary = 'get all users ids from dashboards ids'
    (async () => {
      try {
        const dashboardsIds = req.body;
        /*  #swagger.parameters['dashboardsIds'] = {
          in: 'body',
          description: 'dashboards ids',
          schema: [1, 2, 3]
        } */
        const userIds = await service.retrieveAllUsersIdsFromDashboardsIds(
          dashboardsIds
        );
        /* #swagger.responses[200] = {
            description: 'Returned dashboards ids and users ids linked',
            schema: [1,2]
        } */
        res.status(StatusCodes.OK).json(userIds);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.post("/", (req, res) => {
    // #swagger.summary = 'create a list of users ids and dashboards ids linked'
    (async () => {
      try {
        const newDashboardsUsers = req.body;
        /*  #swagger.parameters['dashboardsUsers'] = {
          in: 'body',
          description: 'dashboards ids and users ids linked',
          schema: [{
            $DashboardId: 1,
            $UserId: 2,
          }       ]
        } */
        const dashboardsUsers = await service.createDashboardsUsers(
          newDashboardsUsers
        );
        /* #swagger.responses[200] = {

            description: 'Returned dashboards ids and users ids linked',
            schema: [{
                $DashboardId: 1,
                $UserId: 2,
            }      ]
        } */
        res.status(StatusCodes.CREATED).json(dashboardsUsers);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  return router;
};
