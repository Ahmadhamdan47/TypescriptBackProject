import express from "express";
import { FeatureServerService } from "../services/feature.server.service";
import { Server } from "http";
import { FeatureFilter } from "../interfaces/featuresFilter";
import { logger } from "../../../logger";
import { StatusCodes } from "http-status-codes";
import {
  permissionsConstants,
  requirePermissions,
} from "../middlewares/permissions.server.middleware";

export const featureServerController = (server: Server) => {
  const service = new FeatureServerService(server);

  const router = express.Router();
  router.use(express.json());

  router.get(
    "/",
    requirePermissions(permissionsConstants.FEATURES.READ),
    (req, res) => {
      // #swagger.summary = 'get all features'
      (async () => {
        try {
          const features = await service.getFeatures();
          /* #swagger.responses[200] = {
            description: 'Returned features',
            schema: [{
              $id: 1,
              $name: 'feature',
              description: 'description'
            }      ]
          } */
          res.status(StatusCodes.OK).json(features);
        } catch (err) {
          logger.error("error while retrieving features! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.post(
    "/filter",
    requirePermissions(permissionsConstants.FEATURES.READ),
    (req, res) => {
      // #swagger.summary = 'get features by filter'
      (async () => {
        try {
          const filters: FeatureFilter = req.body;
          /*  #swagger.parameters['filters'] = {
                  in: 'body',
                  description: 'filter features by rolename and username',
                  schema: {
                      username: 'string',
                      rolename: 'string',
                  }
          } */
          const features = await service.getFeaturesByFilter(filters);
          /* #swagger.responses[200] = {
                description: 'Returned features with filter',
                schema: [{
                    $id: 1,
                    $name: 'feature',
                    description: 'description'
                }      ]
        } */
          res.status(StatusCodes.OK).json(features);
        } catch (error) {
          logger.error("error while retrieving features with filters! ", error);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  /*----------------------------------------------
  |  LINKS
  ------------------------------------------------*/

  router.post(
    "/linkRoles",
    requirePermissions(permissionsConstants.FEATURES.UPDATE),
    (req, res) => {
      // #swagger.summary = 'link feature to n roles'
      (async () => {
        try {
          const roleFeature = req.body;
          /*  #swagger.parameters['NewRoleRole'] = {
            in: 'body',
            description: 'feature id and role id',
            schema: [{
              $FeatureId: 1,
              $RoleId: 1,
            }]
          } */
          await service.addRoles(roleFeature);
          res.sendStatus(StatusCodes.CREATED);
        } catch (err) {
          logger.error("error while linking feature to roles! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  return router;
};
