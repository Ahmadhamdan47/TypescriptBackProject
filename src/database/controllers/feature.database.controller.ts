import express from "express";
import { Server } from "http";
import { logger } from "../../../logger";
import { StatusCodes } from "http-status-codes";
import { FeatureDatabaseService } from "../services/feature.database.service";

export const featureDatabaseController = (server: Server) => {
  const service = new FeatureDatabaseService(server);

  const router = express.Router();
  router.use(express.json());

  router.get("/", (req, res) => {
    // #swagger.summary = 'get all features'
    (async () => {
      try {
        const name = req.query.name;
        /*  #swagger.parameters['name'] = {
          in: 'query',
          type: 'string',
          description: 'feature name.' } */
        const features = await service.retrieveAllFeatures(name);
        /* #swagger.responses[200] = {
            description: 'Returned features',
            schema: [{
                $id: 1,
                $name: 'string',
                description: 'string',
                $type: 'string',
                $icon: 'string',
                $parentFeatureId: 2,
            }      ]
        } */
        res.status(StatusCodes.OK).json(features);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.get("/:id", (req, res) => {
    // #swagger.summary = 'get one feature by id'
    (async () => {
      try {
        const id = req.params.id;
        /*  #swagger.parameters['id'] = {
          in: 'path',
          type: 'integer',
          description: 'feature id.' } */
        const features = await service.retrieveOneFeature(id);
        /* #swagger.responses[200] = {
            description: 'Returned feature',
            schema: {
                $id: 1,
                $name: 'string',
                description: 'string',
                $type: 'string',
                $icon: 'string',
                $parentFeatureId: 2,
            }
        } */
        res.status(StatusCodes.OK).json(features);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  /*----------------------------------------------
  |  LINKS
  ------------------------------------------------*/

  router.post("/linkRoles", (req, res) => {
    // #swagger.summary = 'link a feature with n roles'
    (async () => {
      try {
        const roleFeatures = req.body;
        /*  #swagger.parameters['NewRoleRole'] = {
          in: 'body',
          description: 'feature id and role id',
          schema: [{
            $RoleId: 1,
            $FeatureId: 1,
          }]
        } */
        await service.addRoles(roleFeatures);
        res.sendStatus(StatusCodes.CREATED);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  return router;
};
