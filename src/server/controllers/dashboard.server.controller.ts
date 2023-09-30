import express from "express";
import { DashboardServerService } from "../services/dashboard.server.service";
import { Server } from "http";
import { StatusCodes } from "http-status-codes";
import { logger } from "../../../logger";
import {
  permissionsConstants,
  requirePermissions,
} from "../middlewares/permissions.server.middleware";

export const dashboardServerController = (server: Server) => {
  const service = new DashboardServerService(server);

  const router = express.Router();
  router.use(express.json());

  router.get(
    "/",
    requirePermissions(permissionsConstants.DASHBOARDS.READ),
    (req, res) => {
      (async () => {
        // #swagger.summary = 'get all dashboards'
        try {
          const dashboards = await service.getDashboards();
          /* #swagger.responses[200] = {
            description: 'Returned dashboards',
                schema: [{
                  $id: 1,
                  $name: 'dashboard 1',
                  description: 'Default dashboard',
                  $layout: 'JSON',
                  $widgets: 'JSON',
                  userId: 1,
                }      ]
              } */
          res.status(StatusCodes.OK).json(dashboards);
        } catch (err) {
          logger.error("error while retrieving all dashboards! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.get(
    "/:id",
    requirePermissions(permissionsConstants.DASHBOARDS.READ),
    (req, res) => {
      // #swagger.summary = 'get one dashboard by id'
      (async () => {
        try {
          const id = req.params.id;
          /*  #swagger.parameters['id'] = {
            in: 'path',
            type: 'integer',
            description: 'dashboard ID.' } */
          const dashboards = await service.getDashboard(id);
          /* #swagger.responses[200] = {
              description: 'Returned dashboard',
              schema: {
                $id: 1,
                $name: 'dashboard 1',
                description: 'Default dashboard',
                $layout: 'JSON',
                $widgets: 'JSON',
                userId: 1,
              }
            } */
          res.status(StatusCodes.OK).json(dashboards);
        } catch (err) {
          logger.error("error while retrieving one dashboard! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.delete(
    "/:id",
    requirePermissions(permissionsConstants.DASHBOARDS.DELETE),
    (req, res) => {
      // #swagger.summary = 'delete one dashboard'
      (async () => {
        try {
          const id = req.params.id;
          /*  #swagger.parameters['id'] = {
                in: 'path',
                type: 'integer',
                description: 'dashboard ID.' } */
          await service.deleteDashboard(id);
          res.sendStatus(StatusCodes.OK);
        } catch (err) {
          logger.error("error while removing  dashboard! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.post(
    "/",
    requirePermissions(permissionsConstants.DASHBOARDS.CREATE),
    (req, res) => {
      // #swagger.summary = 'create one dashboard'
      (async () => {
        try {
          const newDashboard = req.body;
          /*  #swagger.parameters['dashboard'] = {
                in: 'body',
                description: 'dashboard to add',
                schema: {
                      $name: 'string',
                      description: 'string',
                      $widgets: 'JSON',
                      $layout: 'JSON',
                      userId: 1,
                }
        } */
          const dashboard = await service.insertDashboard(newDashboard);
          /* #swagger.responses[200] = {
                description: 'the id of the created dashboard',
                schema: {
                    id: 1
                }      
        } */
          res.status(StatusCodes.CREATED).json(dashboard);
        } catch (err) {
          logger.error("error while creating a dashboard! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.put(
    "/:id",
    requirePermissions(permissionsConstants.DASHBOARDS.UPDATE),
    (req, res) => {
      // #swagger.summary = 'update dashboard'
      (async () => {
        try {
          /*  #swagger.parameters['dashboard'] = {
                in: 'body',
                description: 'dashboard to update',
                schema: {
                      name: 'string',
                      description: 'string',
                      widgets: 'JSON',
                      layout: 'JSON',
                      userId: 1,
                }
        } */
          await service.updateDashboard(req.params.id, req.body);
          res.sendStatus(StatusCodes.OK);
        } catch (err) {
          logger.error("error while updating a dashboard! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  /*----------------------------------------------
  |  LINKS
  ------------------------------------------------*/

  router.post(
    "/linkUsers",
    requirePermissions(permissionsConstants.DASHBOARDS.UPDATE),
    (req, res) => {
      // #swagger.summary = 'link a dashboard to n users'
      (async () => {
        try {
          const newDashboardUser = req.body;
          /*  #swagger.parameters['NewDashboardUser'] = {
                in: 'body',
                description: 'dashboard id and user id',
                schema: [{
                      $DashboardId: 1,
                      $UserId: 1
                }]
        } */
          await service.addUsers(newDashboardUser);
          res.sendStatus(StatusCodes.CREATED);
        } catch (err) {
          logger.error(
            "error while linking the dashboard with the user! ",
            err
          );
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  return router;
};
