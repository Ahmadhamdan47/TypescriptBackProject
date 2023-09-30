import express from "express";
import { ManagementAreaServerService } from "../services/managementArea.server.service";
import { Server } from "http";
import { ManagementAreaFilter } from "../interfaces/managementAreasFilter";
import { logger } from "../../../logger";
import { StatusCodes } from "http-status-codes";
import {
  permissionsConstants,
  requirePermissions,
} from "../middlewares/permissions.server.middleware";

export const managementAreaServerController = (server: Server) => {
  const service = new ManagementAreaServerService(server);

  const router = express.Router();
  router.use(express.json());

  router.get(
    "/",
    requirePermissions(permissionsConstants.MANAGEMENT_AREAS.READ),
    (req, res) => {
      // #swagger.summary = 'get all management areas '
      (async () => {
        try {
          const managementAreas = await service.getManagementAreas();
          /* #swagger.responses[200] = {
            description: 'Returned management areas',
            schema: [{
              $id: 1,
              $name: 'string',
              description: 'description'
              }      ]
            } */
          res.status(StatusCodes.OK).json(managementAreas);
        } catch (err) {
          logger.error("error while retrieving all management areas! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.post(
    "/filter",
    requirePermissions(permissionsConstants.MANAGEMENT_AREAS.READ),
    (req, res) => {
      // #swagger.summary = 'get management areas'
      (async () => {
        try {
          const filters: ManagementAreaFilter = req.body;
          /*  #swagger.parameters['filters'] = {
                  in: 'body',
                  description: 'filter management areas by  username',
                  schema: {
                      username: 'string'
                  }
          } */
          const managmentUnits = await service.getManagementAreasByFilter(
            filters
          );
          /* #swagger.responses[200] = {
            description: 'Returned management areas with filter',
            schema: [{
              $id: 1,
              $name: 'string',
              description: 'description'
            }      ]
          } */
          res.status(StatusCodes.OK).json(managmentUnits);
        } catch (error) {
          logger.error(
            "error while retrieving management areas with filters! ",
            error
          );
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.delete(
    "/:id",
    requirePermissions(permissionsConstants.MANAGEMENT_AREAS.DELETE),
    (req, res) => {
      // #swagger.summary = 'delete a management area'
      (async () => {
        try {
          const id = req.params.id;
          /*  #swagger.parameters['id'] = {
                in: 'path',
                type: 'integer',
                description: 'management area ID.' } */
          await service.deleteManagementArea(id);
          res.sendStatus(StatusCodes.OK);
        } catch (err) {
          logger.error("error while deleting management area! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.post(
    "/",
    requirePermissions(permissionsConstants.MANAGEMENT_AREAS.CREATE),
    (req, res) => {
      // #swagger.summary = 'create a management area'
      (async () => {
        try {
          const newManagementArea = req.body;
          /*  #swagger.parameters['managementArea'] = {
                in: 'body',
                description: 'new management area object',
                schema: {
                    $name: 'string',
                    description: 'string'
                }
        } */
          const managementArea = await service.insertManagementArea(
            newManagementArea
          );
          /* #swagger.responses[200] = {
            description: 'the id of the created management Area',
            schema: {
              $id: 1,
              $name: 'string',
              description: 'string',
              userIds: [1,2,3]
            }      
          } */
          res.status(StatusCodes.CREATED).json(managementArea);
        } catch (err) {
          logger.error("error while creating management area! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.put(
    "/",
    requirePermissions(permissionsConstants.MANAGEMENT_AREAS.UPDATE),
    (req, res) => {
      // #swagger.summary = 'update a management area'
      (async () => {
        try {
          const params = req.body;
          /*  #swagger.parameters['managementArea'] = {
                in: 'body',
                description: 'update management area object',
                schema: {
                    name: 'string',
                    description: 'string'
                }
        } */
          await service.updateManagementArea(params);
          res.sendStatus(StatusCodes.OK);
        } catch (err) {
          logger.error("error while updating management area! ", err);
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
    requirePermissions(permissionsConstants.MANAGEMENT_AREAS.UPDATE),
    (req, res) => {
      // #swagger.summary = 'link a management area with n users'
      (async () => {
        try {
          const managementAreaUser = req.body;
          /*  #swagger.parameters['linkManagementAreaUsers'] = {
                in: 'body',
                description: 'ManagementArea id and user id',
                schema: [{
                      $ManagementAreaId: 1,
                      $UserId: 1,
                }]
        } */
          await service.addUsers(managementAreaUser);
          res.sendStatus(StatusCodes.CREATED);
        } catch (err) {
          logger.error("error while linking management area with users! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  return router;
};
