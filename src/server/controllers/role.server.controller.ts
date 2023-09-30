import express from "express";
import { RoleServerService } from "../services/role.server.service";
import { Server } from "http";
import { RoleFilter } from "../interfaces/rolesFilter";
import { logger } from "../../../logger";
import { StatusCodes } from "http-status-codes";
import {
  permissionsConstants,
  requirePermissions,
} from "../middlewares/permissions.server.middleware";

export const roleServerController = (server: Server) => {
  const service = new RoleServerService(server);

  const router = express.Router();
  router.use(express.json());

  router.post(
    "/",
    requirePermissions(permissionsConstants.ROLES.CREATE),
    (req, res) => {
      // #swagger.summary = 'add a role'
      (async () => {
        try {
          const newRole = req.body;
          /*  #swagger.parameters['NewRole'] = {
                in: 'body',
                description: 'role to add',
                schema: {
                      $name: 'string',
                      description: 'string',
                      featureIds: [1],
                      userIds: [1]
                }
        } */
          const role = await service.insertRole(newRole);
          /* #swagger.responses[201] = {
                description: 'Returned role',
                schema: {
                  $id: 2,
                  $name: 'string',
                  description: 'string',
                  featureIds: [1],
                  userIds: [1]
                }
        } */
          res.status(StatusCodes.CREATED).json(role);
        } catch (err) {
          logger.error("error while creating role! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.get(
    "/",
    requirePermissions(permissionsConstants.ROLES.READ),
    (req, res) => {
      // #swagger.summary = 'get all roles'
      (async () => {
        try {
          const roles = await service.getRoles();
          /* #swagger.responses[200] = {
            description: 'Returned roles',
            schema: [{
                  $id: 2,
                  $name: 'string',
                  description: 'string',
                  featureIds: [1],
                  userIds: [1]
                }      ]
          } */
          res.status(StatusCodes.OK).json(roles);
        } catch (err) {
          logger.error("error while retrieving roles! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.post(
    "/filter",
    requirePermissions(permissionsConstants.ROLES.READ),
    (req, res) => {
      // #swagger.summary = 'get roles by filter'
      (async () => {
        try {
          const filters: RoleFilter = req.body;
          /*  #swagger.parameters['filters'] = {
              in: 'body',
              description: 'filter roles by username and features',
              schema: {
                  username: 'string',
                  features: ['string']
              }
      } */
          const roles = await service.getRolesByFilter(filters);
          /* #swagger.responses[200] = {
            description: 'Returned filtered roles',
            schema: [{
                  $id: 2,
                  $name: 'string',
                  description: 'string',
                  featureIds: [1],
                  userIds: [1]
                }      ]
          } */
          res.status(StatusCodes.OK).json(roles);
        } catch (error) {
          logger.error("error while retrieving roles with filters! ", error);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.put(
    "/:id",
    requirePermissions(permissionsConstants.ROLES.UPDATE),
    (req, res) => {
      // #swagger.summary = 'insert or update a role'
      (async () => {
        try {
          const id = req.params.id;
          /* #swagger.parameters['id'] = {
                in: 'path',
                type: 'integer',
                description: 'role ID.' } */
          const params = req.body;
          /*  #swagger.parameters['user'] = {
                  in: 'body',
                  description: 'user to add or to update',
                  schema: {
                        name: 'string',
                        description: 'string',
                        featureId: 1,
                  }
          } */
          await service.updateRole(id, params);
          res.sendStatus(StatusCodes.OK);
        } catch (error) {
          logger.error("error while updating role! ", error);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.delete(
    "/",
    requirePermissions(permissionsConstants.ROLES.DELETE),
    (req, res) => {
      // #swagger.summary = 'delete all roles or by name'
      (async () => {
        try {
          const name = req.query.name?.toString() ?? "";
          /* #swagger.parameters['name'] = {
                in: 'query',
                type: 'string',
                description: 'role name.' } */
          await service.deleteRole(name);
          res.sendStatus(StatusCodes.OK);
        } catch (error) {
          logger.error("error while deleting role! ", error);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.delete(
    "/:id",
    requirePermissions(permissionsConstants.ROLES.DELETE),
    (req, res) => {
      // #swagger.summary = 'delete one role'
      (async () => {
        try {
          const id = req.params.id;
          /* #swagger.parameters['id'] = {
              in: 'path',
              type: 'integer',
              description: 'role ID.' } */
          await service.deleteRoleById(id);
          res.sendStatus(StatusCodes.OK);
        } catch (error) {
          logger.error("error while deleting role! ", error);
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
    requirePermissions(permissionsConstants.ROLES.UPDATE),
    (req, res) => {
      // #swagger.summary = 'link a role to n users'
      (async () => {
        try {
          const roleUser = req.body;
          /*  #swagger.parameters['NewRoleUser'] = {
            in: 'body',
            description: 'role id and users id',
            schema: [{
              $RoleId: 1,
              $UsersId: 1,
            }]
          } */
          await service.addUsers(roleUser);
          res.sendStatus(StatusCodes.CREATED);
        } catch (err) {
          logger.error("error while linking role to users! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.post(
    "/linkFeatures",
    requirePermissions(permissionsConstants.ROLES.UPDATE),
    (req, res) => {
      // #swagger.summary = 'link role to features'
      (async () => {
        try {
          const roleFeature = req.body;
          /*  #swagger.parameters['NewRoleFeature'] = {
            in: 'body',
            description: 'role id and features id',
            schema: [{
              $RoleId: 1,
              $FeaturesId: 1,
            }]
          } */
          await service.addFeatures(roleFeature);
          res.sendStatus(StatusCodes.CREATED);
        } catch (err) {
          logger.error("error while linking role to features! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  return router;
};
