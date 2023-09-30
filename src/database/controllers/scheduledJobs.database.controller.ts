import express from "express";
import { Server } from "http";
import { logger } from "../../../logger";
import { StatusCodes } from "http-status-codes";
import { ScheduledJobsDatabaseService } from "../services/scheduledJobs.database.service";

export const scheduledJobsDatabaseController = (scheduledJobs: Server) => {
  const service = new ScheduledJobsDatabaseService(scheduledJobs);

  const router = express.Router();
  router.use(express.json());

  router.post("/", (req, res) => {
    const newScheduledJob = req.body;
    // #swagger.summary = 'insert a scheduled job'
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
    (async () => {
      try {
        const scheduledJob = await service.insertScheduledJob(newScheduledJob);
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
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.get("/", (req, res) => {
    // #swagger.summary = 'get all scheduled jobs'
    (async () => {
      try {
        const scheduledJobs = await service.retrieveAllScheduledJobs();
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
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.get("/:id", (req, res) => {
    // #swagger.summary = 'get one scheduled job by id'
    (async () => {
      try {
        const id = req.params.id;
        /*  #swagger.parameters['id'] = {
                in: 'path',
                description: 'Scheduled job id',
                required: true,
                type: 'integer'
        } */
        const scheduledJob = await service.retrieveOneScheduledJobById(id);
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
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.put("/:id", (req, res) => {
    // #swagger.summary = 'update a scheduled job status'
    (async () => {
      try {
        const id = req.params.id;
        /*  #swagger.parameters['id'] = {
                in: 'path',
                description: 'Scheduled job id',
                required: true,
                type: 'integer'
        } */
        const scheduledJob = req.body;
        /*  #swagger.parameters['message'] = {
                in: 'body',
                description: 'update a scheduled job status',
                schema: {
                      $active: 1,
                }
        } */
        await service.updateScheduledJobById(id, scheduledJob);
        res.sendStatus(StatusCodes.OK);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.delete("/", (req, res) => {
    // #swagger.summary = 'delete all scheduled jobs'
    (async () => {
      try {
        await service.deleteAllScheduledJobs();
        res.sendStatus(StatusCodes.NO_CONTENT);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.delete("/:id", (req, res) => {
    // #swagger.summary = 'delete a scheduled job'
    (async () => {
      try {
        const id = req.params.id;
        /* #swagger.parameters['id'] = {
                in: 'path',
                description: 'Scheduled job id',
                required: true,
                type: 'integer'
        } */
        await service.deleteOneScheduledJobById(id);
        res.sendStatus(StatusCodes.NO_CONTENT);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  return router;
};
