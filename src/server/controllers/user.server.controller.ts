import express, { Request } from "express";
import { UserServerService } from "../services/user.server.service";
import { Server } from "http";
import { logger } from "../../../logger";
import { StatusCodes } from "http-status-codes";
import { UserServerInterface } from "../interfaces/user.server";
import { UserFilter } from "../interfaces/usersFilter";
import {
  permissionsConstants,
  requirePermissions,
} from "../middlewares/permissions.server.middleware";

export const userServerController = (server: Server) => {
  const service = new UserServerService(server);

  const router = express.Router();
  router.use(express.json());

  router.get(
    "/ad",
    requirePermissions(permissionsConstants.USERS.READ),
    (req, res) => {
      // #swagger.summary = 'get all users from active directory'
      (async () => {
        try {
          const users = await service.getActiveDirectoryUsers();
          /* #swagger.responses[200] = {
            description: 'Returned users from active directory',
            schema: [{
              dn: 'string',
              userPrincipalName: 'string',
              sAMAccountName: 'string',
              sn: 'string',
              givenName: 'string',
              cn: 'string',
              displayName: 'string'
            }      ]
          } */
          res.status(StatusCodes.OK).json(users);
        } catch (err) {
          logger.error("error while retrieving users from active directory! ");
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.get(
    "/",
    requirePermissions(permissionsConstants.USERS.READ),
    (req, res) => {
      // #swagger.summary = 'get all users'
      (async () => {
        try {
          const users = await service.getUsers();
          /* #swagger.responses[200] = {
                description: 'Returned users',
                schema: [{
                    $id: 1,
                    $name: 'xtvision',
                    description: 'Default user',
                    $language: 'fr',
                    $time_zone: 'UTC+1',
                    $createdAt: '2022-08-05T10:04:24.651Z',
                    $updatedAt: '2022-08-05T10:04:24.651Z',
                    Roles: [
                      {
                        $name: 'Configuration'
                      },
                      {
                        $name: 'Exploitation'
                      }
                    ],
                    ManagementAreas: []
                }      ]
        } */
          res.status(StatusCodes.OK).json(users);
        } catch (err) {
          logger.error("error while retrieving users! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.get(
    "/:id",
    requirePermissions(permissionsConstants.USERS.READ),
    (req, res) => {
      // #swagger.summary = 'get specific user by id'
      (async () => {
        try {
          const id = req.params.id;
          /* #swagger.parameters['id'] = {
                in: 'path',
                type: 'integer',
                description: 'user ID.' } */
          const user = await service.getUser(id);
          /* #swagger.responses[200] = {
                description: 'Returned user by id',
                schema: {
                    $id: 1,
                    $name: 'xtvision',
                    description: 'Default user',
                    $language: 'fr',
                    $time_zone: 'UTC+1',
                    $createdAt: '2022-08-05T10:04:24.651Z',
                    $updatedAt: '2022-08-05T10:04:24.651Z',
                    Roles: [
                      {
                        $name: 'Configuration'
                      },
                      {
                        $name: 'Exploitation'
                      }
                    ],
                    ManagementAreas: []
                }  
        } */
          res.status(StatusCodes.OK).json(user);
        } catch (err) {
          logger.error("error while retrieving user by id! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.put(
    "/:id",
    requirePermissions(permissionsConstants.USERS.UPDATE),
    (req, res) => {
      // #swagger.summary = 'Update a user'
      (async () => {
        try {
          const id = req.params.id;
          /* #swagger.parameters['id'] = {
                in: 'path',
                type: 'integer',
                description: 'user ID.' } */
          const user = req.body as UserServerInterface;
          /*  #swagger.parameters['user'] = {
                in: 'body',
                description: 'user to update',
                schema: {
                      password: 'string',
                      description: 'string',
                      language: 'string',
                      time_zone: 'string',
                }
        } */
          await service.updateUser(id, user);
          res.sendStatus(StatusCodes.OK);
        } catch (err) {
          logger.error("error while updating user! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.post(
    "/",
    requirePermissions(permissionsConstants.USERS.CREATE),
    (req, res) => {
      // #swagger.summary = 'Create a user'
      (async () => {
        try {
          const newUser = req.body as UserServerInterface;
          /*  #swagger.parameters['user'] = {
                in: 'body',
                description: 'user to create',
                schema: {
                      $name: 'string',
                      password: 'string',
                      description: 'string',
                      $language: 'string',
                      $time_zone: 'string',
                }
        } */
          const user = await service.insertUser(newUser);
          /* #swagger.responses[200] = {
          description: 'Returned user',
          schema: {
            $id: 1,
            $name: 'xtvision',
            description: 'Default user',
            $language: 'fr',
            $time_zone: 'UTC+1',
            roleIds: [1,2],
            dashboardIds: [1,2],
            managementAreaIds: [1,2],
          }
        }
        */
          res.status(StatusCodes.OK).json(user);
        } catch (err) {
          logger.error("error while creating user! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.post(
    "/filter",
    requirePermissions(permissionsConstants.USERS.READ),
    (req, res) => {
      // #swagger.summary = 'Get users by filter'
      (async () => {
        try {
          const filters: UserFilter = req.body;
          /*  #swagger.parameters['filters'] = {
                in: 'body',
                description: 'filter users by',
                schema: {
                      name: 'string',
                      roles: ['string'],
                }
        } */
          const users = await service.getUsersByFilter(filters);
          /* #swagger.responses[200] = {
            description: 'Returned users',
            schema: [{
            $id: 1,
            $name: 'xtvision',
            description: 'Default user',
            $language: 'fr',
            $time_zone: 'UTC+1',
            roleIds: [1,2],
            dashboardIds: [1,2],
            managementAreaIds: [1,2],
          }      ]
          } */
          res.status(StatusCodes.OK).json(users);
        } catch (err) {
          logger.error("error while retrieving users with filters! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.delete(
    "/:id",
    requirePermissions(permissionsConstants.USERS.DELETE),
    (req: Request, res) => {
      // #swagger.summary = 'delete one user by id'
      (async () => {
        try {
          const id = req.params.id;
          /* #swagger.parameters['id'] = {
                in: 'path',
                type: 'integer',
                description: 'user ID.' } */
          await service.deleteUser(id);
          res.sendStatus(StatusCodes.OK);
        } catch (err) {
          logger.error("error while deleting user by id! ", err);
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
    requirePermissions(permissionsConstants.USERS.UPDATE),
    (req, res) => {
      // #swagger.summary = 'link a user with n roles'
      (async () => {
        try {
          const roleUser = req.body;
          /*  #swagger.parameters['NewRoleUser'] = {
            in: 'body',
            description: 'role id and user id',
            schema: [{
              $RoleId: 1,
              $UserId: 1
            }]
          } */
          await service.addRoles(roleUser);
          res.sendStatus(StatusCodes.OK);
        } catch (err) {
          logger.error("error while linking user with roles! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.post(
    "/linkDashboards",
    requirePermissions(permissionsConstants.USERS.UPDATE),
    (req, res) => {
      // #swagger.summary = 'link a user with n dashboards'
      (async () => {
        try {
          const dashboardUser = req.body;
          /*  #swagger.parameters['NewDashboardUser'] = {
            in: 'body',
            description: 'dashboard id and user id',
            schema: [{
              $DashboardId: 1,
              $UserId: 1
            }]
          } */
          await service.addDashboards(dashboardUser);
          res.sendStatus(StatusCodes.OK);
        } catch (err) {
          logger.error("error while linking user with dashboards! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.post(
    "/linkManagementAreas",
    requirePermissions(permissionsConstants.USERS.UPDATE),
    (req, res) => {
      // #swagger.summary = 'link a user with n managementAreas'
      (async () => {
        try {
          const managementAreaUser = req.body;
          /*  #swagger.parameters['linkManagementAreaUser'] = {
            in: 'body',
            description: 'managementArea id and user id',
            schema: [{
              $ManagementAreaId: 1,
              $UserId: 1
            }]
          } */
          await service.addManagementAreas(managementAreaUser);
          res.sendStatus(StatusCodes.OK);
        } catch (err) {
          logger.error("error while linking user with managementAreas! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.post(
    "/linkCategory",
    requirePermissions(permissionsConstants.USERS.UPDATE),
    (req, res) => {
      // #swagger.summary = 'link a user with n categories'
      (async () => {
        try {
          const categoryUser = req.body;
          /*  #swagger.parameters['linkCategoryUser'] = {
            in: 'body',
            description: 'category id and user id',
            schema: [{
              $CategoryId: 1,
              $UserId: 1
            }]
          } */
          await service.addCategories(categoryUser);
          res.sendStatus(StatusCodes.OK);
        } catch (err) {
          logger.error("error while linking user with categories! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  return router;
};
