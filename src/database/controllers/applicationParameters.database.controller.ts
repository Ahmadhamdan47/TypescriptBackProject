import express from "express";
import { Server } from "http";
import { logger } from "../../../logger";
import { StatusCodes } from "http-status-codes";
import { ApplicationParametersDatabaseService } from "../services/applicationParameters.database.service";

export const applicationParametersDatabaseController = (
  applicationParameters: Server
) => {
  const service = new ApplicationParametersDatabaseService(
    applicationParameters
  );

  const router = express.Router();
  router.use(express.json());

  router.get("/", (req, res) => {
    // #swagger.summary = 'get all application parameters'
    (async () => {
      try {
        const applicationParameters =
          await service.retrieveAllApplicationParameters();
        /* #swagger.responses[200] = {
            description: 'Returned application parameters',
            schema: {
              $id: 1,
              $counter: 1,
              $value: 'string',
            }  
          } */
        res.status(StatusCodes.OK).json(applicationParameters);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.put("/", (req, res) => {
    // #swagger.summary = 'update application parameters'
    (async () => {
      try {
        const parameters = req.body;
        /*  #swagger.parameters['parameters'] = {
          in: 'body',
          description: 'application parameters',
          schema: {
            id: 'integer',
            counter: 'integer',
            value: 'string',
          }
        } */
        await service.updateApplicationParameters(parameters);
        res.sendStatus(StatusCodes.OK);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  return router;
};
