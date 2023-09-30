import express from "express";
import { Server } from "http";
import { logger } from "../../../logger";
import { StatusCodes } from "http-status-codes";
import { ApplicationParametersServerService } from "../services/applicationParameters.server.service";
import { ApplicationParametersServerInterface } from "../interfaces/applicationParameters.server";
import {
  permissionsConstants,
  requirePermissions,
} from "../middlewares/permissions.server.middleware";

export const applicationParametersServerController = (
  applicationParameters: Server
) => {
  const service = new ApplicationParametersServerService(applicationParameters);

  const router = express.Router();
  router.use(express.json());

  router.get(
    "/",
    requirePermissions(permissionsConstants.APPLICATION_PARAMETERS.READ),
    (req, res) => {
      // #swagger.summary = 'get all application parameters'
      (async () => {
        try {
          const applicationParameters =
            await service.getApplicationParameters();
          /* #swagger.responses[200] = {
            description: 'Returned application parameters',
            schema: {
            }  
          } */
          res.status(StatusCodes.OK).json(applicationParameters);
        } catch (err) {
          logger.error(
            "error while retrieving all application parameters! ",
            err
          );
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.put(
    "/",
    requirePermissions(permissionsConstants.APPLICATION_PARAMETERS.UPDATE),
    (req, res) => {
      // #swagger.summary = 'update application parameters'
      (async () => {
        try {
          const applicationParameters: ApplicationParametersServerInterface =
            req.body;
          /*  #swagger.parameters['applicationParameters'] = {
                    in: 'body',
                    description: 'application parameters object',
                    schema: {
                    }
            } */
          await service.updateApplicationParameters(applicationParameters);
          res.sendStatus(StatusCodes.OK);
        } catch (err) {
          logger.error("error while updating application parameters! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  return router;
};
