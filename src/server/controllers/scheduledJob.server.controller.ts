import express from "express";
import { Server } from "http";
import { logger } from "../../../logger";
import { ScheduledJobServerService } from "../services/scheduledJobs.server.service";
import { StatusCodes } from "http-status-codes";
import {
  permissionsConstants,
  requirePermissions,
} from "../middlewares/permissions.server.middleware";

export const scheduledJobsServerController = (server: Server) => {
  const service = new ScheduledJobServerService(server);

  const router = express.Router();
  router.use(express.json());

  router.post(
    "/",
    requirePermissions(permissionsConstants.SCHEDULED_JOBS.CREATE),
    (req, res) => {
      // #swagger.summary = 'insert a scheduled job'
      (async () => {
        try {
          const newScheduledJob = req.body;
          /* #swagger.parameters['obj'] = {
                in: 'body',
                description: 'Scheduled job to insert',
                required: true,
                schema: {
                    $name: 'string',
                    description: 'string',
                    $task: 'string',
                    date: Date,
                    cron: 'string',
                    param1: 1,
                    active: 1,
                }
        } */
          const scheduledJob = await service.insertScheduledJob(
            newScheduledJob
          );
          /* #swagger.responses[200] = {
            description: 'Scheduled job inserted',
            schema: {
              $id: 1,
              $name: 'string',
              description: 'string',
              $task: 'string',
              date: Date,
              cron: 'string',
              param1: 1,
              active: 1,
            }
          } */
          res.status(StatusCodes.OK).json(scheduledJob);
        } catch (err) {
          logger.error("error while inserting scheduled job! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.get(
    "/",
    requirePermissions(permissionsConstants.SCHEDULED_JOBS.READ),
    (req, res) => {
      // #swagger.summary = 'get all scheduled jobs'
      (async () => {
        try {
          const scheduledJobs = await service.getScheduledJobs();
          /* #swagger.responses[200] = {
            description: 'Returned scheduled jobs',
            schema: [{
              $id: 1,
              $name: 'string',
              description: 'string',
              $task: 'string',
              date: Date,
              cron: 'string',
              param1: 1,
              active: 1,
            }      ]
          } */
          res.status(StatusCodes.OK).json(scheduledJobs);
        } catch (err) {
          logger.error("error while retrieving scheduled jobs! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.get(
    "/:id",
    requirePermissions(permissionsConstants.SCHEDULED_JOBS.READ),
    (req, res) => {
      // #swagger.summary = 'get a scheduled job by id'
      (async () => {
        try {
          const id = req.params.id;
          /* #swagger.parameters['id'] = {
                in: 'path',
                type: 'integer',
                description: 'scheduled job ID.' } */
          const scheduledJob = await service.getScheduledJobById(id);
          /* #swagger.responses[200] = {
            description: 'Returned scheduled job',
            schema: {
              $id: 1,
              $name: 'string',
              description: 'string',
              $task: 'string',
              date: Date,
              cron: 'string',
              param1: 1,
              active: 1,
            }
          } */
          res.status(StatusCodes.OK).json(scheduledJob);
        } catch (err) {
          logger.error("error while retrieving scheduled job by id! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.put(
    "/:id",
    requirePermissions(permissionsConstants.SCHEDULED_JOBS.UPDATE),
    (req, res) => {
      // #swagger.summary = 'update a scheduled job "active" status'
      (async () => {
        try {
          const id = req.params.id;
          /* #swagger.parameters['id'] = {
                in: 'path',
                type: 'integer',
                description: 'scheduled job ID.' } */
          const params = req.body;
          /*  #swagger.parameters['message'] = {
                in: 'body',
                description: 'update scheduled job active status',
                schema: {
                      $active: true,
                }
        } */
          await service.updateScheduledJobActiveStatusById(id, params);
          res.sendStatus(StatusCodes.OK);
        } catch (err) {
          logger.error(
            "error while updating scheduled job active status by id! ",
            err
          );
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.delete(
    "/:id",
    requirePermissions(permissionsConstants.SCHEDULED_JOBS.DELETE),
    (req, res) => {
      // #swagger.summary = 'delete a scheduled job'
      (async () => {
        try {
          const id = req.params.id;
          /* #swagger.parameters['id'] = {
                in: 'path',
                type: 'integer',
                description: 'scheduled job ID.' } */
          await service.deleteScheduledJobById(id);
          res.sendStatus(StatusCodes.OK);
        } catch (err) {
          logger.error("error while deleting scheduled job by id! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  return router;
};
