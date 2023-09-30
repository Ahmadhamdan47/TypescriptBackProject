import express from "express";
import { Server } from "http";
import { logger } from "../../../logger";
import { StatusCodes } from "http-status-codes";
import { NewRoleFeature } from "../interfaces/roleFeature.database";
import { RoleFeatureDatabaseService } from "../services/roleFeature.database.service";

export const roleFeatureDatabaseController = (server: Server) => {
  const service = new RoleFeatureDatabaseService(server);

  const router = express.Router();
  router.use(express.json());

  router.get("/", (req, res) => {
    // #swagger.summary = 'get all roles and features linked'
    (async () => {
      try {
        const roleId = req.query.roleId;
        /*  #swagger.parameters['roleId'] = {
          in: 'query',
          type: 'integer',
          description: 'role ID.' } */
        const featureId = req.query.featureId;
        /*  #swagger.parameters['featureId'] = {
          in: 'query',
          type: 'integer',
          description: 'feature ID.' } */
        const roleFeatures = await service.retrieveAllRolesFeatures(
          roleId,
          featureId
        );
        /* #swagger.responses[200] = {
            description: 'Returned roles ids and features ids linked',
            schema: [{
              FeatureId: 1,
              RoleId: 2,
            }      ]
          } */
        res.status(StatusCodes.OK).json(roleFeatures);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.post("/featuresIds", (req, res) => {
    // #swagger.summary = 'get all features ids from roles ids'
    (async () => {
      try {
        const ids = req.body;
        /*  #swagger.parameters['ids'] = {
          in: 'body',
          description: 'roles ids',
          schema: [1, 2, 3]
        } */
        const featuresIds = await service.retrieveAllFeaturesIdsFromRolesIds(
          ids
        );
        /* #swagger.responses[200] = {
            description: 'Returned features ids from roles ids',
            schema: [1,2]
        } */
        res.status(StatusCodes.OK).json(featuresIds);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.post("/", (req, res) => {
    // #swagger.summary = 'create a list of features ids and roles ids linked'
    (async () => {
      try {
        const roleFeatures = req.body as NewRoleFeature[];
        /*  #swagger.parameters['NewRoleFeature'] = {
          in: 'body',
          description: 'role id and feature id',
          schema: [{
            $RoleId: 1,
            $FeatureId: 1
          }]
        } */
        await service.createRolesFeatures(roleFeatures);
        res.sendStatus(StatusCodes.CREATED);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  return router;
};
