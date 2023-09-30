import express from "express";
import { Server } from "http";
import { DashboardDatabaseService } from "../services/dashboard.database.service";
import { logger } from "../../../logger";
import { StatusCodes } from "http-status-codes";

export const dashboardDatabaseController = (server: Server) => {
  const service = new DashboardDatabaseService(server);

  const router = express.Router();
  router.use(express.json());

  router.get("/", (req, res) => {
    // #swagger.summary = 'get all dashboards '
    (async () => {
      try {
        const dashboards = await service.retrieveAllDashboards();
        /* #swagger.responses[200] = {

            description: 'Returned dashboards',
            schema: [{
                $id: 1,
                $name: 'string',
                description: 'string',
                $layout: 'JSON',
                $widgets: 'JSON',
            }      ]
        } */
        res.status(StatusCodes.OK).json(dashboards);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.get("/:id", (req, res) => {
    // #swagger.summary = 'get one dashboard by id '
    (async () => {
      try {
        const id = req.params.id;
        /*  #swagger.parameters['id'] = {
            in: 'path',
            type: 'integer',
            description: 'dashboard ID.' } */
        const dashboards = await service.retrieveOneDashboard(id);
        /* #swagger.responses[200] = {
            description: 'Returned dashboards',
            schema: {
                $id: 1,
                $name: 'string',
                description: 'string',
                $layout: 'JSON',
                $widgets: 'JSON',
            }      
        } */
        res.status(StatusCodes.OK).json(dashboards);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.post("/", (req, res) => {
    // #swagger.summary = 'create one dashboard'
    (async () => {
      try {
        const newDashboard = req.body;
        /*  #swagger.parameters['dashboard'] = {
                in: 'body',
                description: 'dashboard to add',
                schema: {
                      $name: 'string',
                      $description: 'string',
                      $layout: 'string',
                      $widgets: 'string',
                }
        } */
        const dashboard = await service.createOneDashboard(newDashboard);
        /* #swagger.responses[200] = {
            description: 'Returned dashboards',
            schema: {
                $id: 1,
                $name: 'string',
                description: 'string',
                $layout: 'JSON',
                $widgets: 'JSON',
            }
        } */
        res.status(StatusCodes.CREATED).json(dashboard);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.put("/:id", (req, res) => {
    // #swagger.summary = 'update a dashboard'
    (async () => {
      try {
        const id = req.params.id;
        /*  #swagger.parameters['id'] = {
            in: 'path',
            type: 'integer',
            description: 'dashboard ID.' } */
        const parameters = req.body;
        /*  #swagger.parameters['dashboard'] = {
                in: 'body',
                description: 'dashboard to update',
                schema: {
                      $name: 'string',
                      $description: 'string',
                      $layout: 'string',
                      $widgets: 'string',
                }
        } */
        await service.updateDashboardById(id, parameters);
        res.sendStatus(StatusCodes.OK);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.delete("/", (req, res) => {
    // #swagger.summary = 'delete all dashboards '
    (async () => {
      try {
        await service.deleteAllDashboards();
        res.sendStatus(StatusCodes.OK);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.delete("/:id", (req, res) => {
    // #swagger.summary = 'delete one dashboard by id '
    (async () => {
      try {
        const id = req.params.id;
        /*  #swagger.parameters['id'] = {
            in: 'path',
            type: 'integer',
            description: 'dashboard ID.' } */
        await service.deleteOneDashboardById(id);
        res.sendStatus(StatusCodes.OK);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  return router;
};
