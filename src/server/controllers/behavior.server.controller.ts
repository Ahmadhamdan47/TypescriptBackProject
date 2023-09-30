import express from "express";
import { Server } from "http";
import { logger } from "../../../logger";
import { StatusCodes } from "http-status-codes";
import { NewBehavior } from "../../database/interfaces/behavior.database";
import { BehaviorFilter } from "../interfaces/behaviorsFilter";
import { BehaviorServerService } from "../services/behavior.server.service";
import {
  permissionsConstants,
  requirePermissions,
} from "../middlewares/permissions.server.middleware";

export const behaviorServerController = (server: Server) => {
  const service = new BehaviorServerService(server);

  const router = express.Router();
  router.use(express.json());

  router.get(
    "/",
    requirePermissions(permissionsConstants.BEHAVIORS.READ),
    (req, res) => {
      // #swagger.summary = 'get all behaviors'
      (async () => {
        try {
          const behaviors = await service.getBehaviors();
          /* #swagger.responses[200] = {
            description: 'Returned behaviors',
            schema: [{
              $id: 1,
              $name: 'string',
              $icon: 'string',
              $isDefault: true,
              $equipmentTypeId: 5,
            }      ]
          } */
          res.status(StatusCodes.OK).json(behaviors);
        } catch (err) {
          logger.error("error while retrieving all behaviors! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.post(
    "/filter",
    requirePermissions(permissionsConstants.BEHAVIORS.READ),
    (req, res) => {
      // #swagger.summary = 'get behaviors by filter'
      (async () => {
        try {
          const filters: BehaviorFilter = req.body;
          /*  #swagger.parameters['filters'] = {
                in: 'body',
                description: 'filter behaviors by type',
                schema: {
                    $type: 'string'
                }
        } */
          const behaviors = await service.getBehaviorsByFilter(filters);
          /* #swagger.responses[200] = {
          description: 'Returned behaviors with filters',
          schema: [{
            $id: 1,
            $name: 'string',
            $icon: 'string',
            $isDefault: true,
            $equipmentTypeId: 5,
          }      ]
        } */
          res.status(StatusCodes.CREATED).json(behaviors);
        } catch (err) {
          logger.error("error while retrieving behaviors with filters! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.delete(
    "/:id",
    requirePermissions(permissionsConstants.BEHAVIORS.DELETE),
    (req, res) => {
      // #swagger.summary = 'delete a behavior'
      (async () => {
        try {
          const id = req.params.id;
          /*  #swagger.parameters['id'] = {
                in: 'path',
                type: 'integer',
                description: 'behavior ID.' } */
          await service.deleteBehavior(id);
          res.sendStatus(StatusCodes.OK);
        } catch (err) {
          logger.error("error while deleting behavior! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.put(
    "/",
    requirePermissions(permissionsConstants.BEHAVIORS.UPDATE),
    (req, res) => {
      // #swagger.summary = 'create a behavior'
      (async () => {
        try {
          const behavior = req.body as NewBehavior;
          /*  #swagger.parameters['behavior'] = {
                in: 'body',
                description: 'new behavior object or update object',
                schema: {
                    $name: 'string',
                    $icon: 'string',
                    $isDefault: true,
                    $equipmentTypeId: 5,
                }
        } */
          await service.updateBehavior(behavior);
          res.sendStatus(StatusCodes.OK);
        } catch (err) {
          logger.error("error while updating behavior! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  return router;
};
