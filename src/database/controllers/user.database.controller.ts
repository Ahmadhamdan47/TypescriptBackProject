import { NewUser } from "../interfaces/user.database";
import { UserDatabaseService } from "../services/user.database.service";
import express from "express";
import { Server } from "http";
import { StatusCodes } from "http-status-codes";
import { logger } from "../../../logger";
import { UserFilter } from "../../server/interfaces/usersFilter";

export const userDatabaseController = (server: Server) => {
  const service = new UserDatabaseService(server);

  const router = express.Router();
  router.use(express.json());

  router.get("/", (req, res) => {
    // #swagger.summary = 'get all users'
    (async () => {
      try {
        const name = req.query.name;
        /*  #swagger.parameters['name'] = {
                in: 'query',  
                type: 'string',
                description: 'user name.' } */
        const users = await service.retrieveAllUsers(name);
        /* #swagger.responses[200] = {
                description: 'Returned users',
                schema: [{
                    $id: 1,
                    $name: 'xtvision',
                    $description: 'Default user',
                    $language: 'fr',
                    $time_zone: 'UTC+1',
                    $createdAt: '2022-08-05T10:04:24.651Z',
                    $updatedAt: '2022-08-05T10:04:24.651Z',
                    $Roles: [
                      {
                        $name: 'Configuration'
                      },
                      {
                        $name: 'Exploitation'
                      }
                    ],
                    $ManagementAreas: []
                }      ]
        } */
        res.status(StatusCodes.OK).json(users);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });
  router.put("/:id", (req, res) => {
    // #swagger.summary = 'update a user'
    (async () => {
      try {
        const id = req.params.id;
        /*  #swagger.parameters['id'] = {
                in: 'path',
                type: 'integer',
                description: 'user ID.' } */
        const userToUpdate = req.body as NewUser;

        /*  #swagger.parameters['user'] = {
                in: 'body',
                description: 'user to update',
                schema: {
                      name: 'string',
                      description: 'string',
                      language: 'string',
                      time_zone: 'string',
                }
        } */
        await service.updateUser(id, userToUpdate);
        res.sendStatus(StatusCodes.OK);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.get("/:id", (req, res) => {
    // #swagger.summary = 'get a user by id'
    (async () => {
      try {
        const id = req.params.id;
        /*  #swagger.parameters['id'] = {
                in: 'path',
                type: 'integer',
                description: 'user ID.' } */
        const users = await service.retrieveOneUser(id);
        /* #swagger.responses[200] = {
                description: 'Returned user',
                schema: {
                    $id: 1,
                    $name: 'xtvision',
                    $description: 'Default user',
                    $language: 'fr',
                    $time_zone: 'UTC+1',
                    $createdAt: '2022-08-05T10:04:24.651Z',
                    $updatedAt: '2022-08-05T10:04:24.651Z',
                    $Roles: [
                      {
                        $name: 'Configuration'
                      },
                      {
                        $name: 'Exploitation'
                      }
                    ],
                    $ManagementAreas: []
                }      
        } */
        res.status(StatusCodes.OK).json(users);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.post("/", (req, res) => {
    // #swagger.summary = 'create a user'
    (async () => {
      try {
        const newUser: NewUser = req.body;
        /*  #swagger.parameters['user'] = {
                in: 'body',
                description: 'user to add',
                schema: {
                      name: 'string',
                      description: 'string',
                      language: 'string',
                      time_zone: 'string',
                }
        } */
        const user = await service.createOneUser(newUser);
        /* #swagger.responses[200] = {
                description: 'Returned user',
                schema: {
                    $id: 1,
                    $name: 'xtvision',
                    $description: 'Default user',
                    $language: 'fr',
                    $time_zone: 'UTC+1',
                    $createdAt: '2022-08-05T10:04:24.651Z',
                    $updatedAt: '2022-08-05T10:04:24.651Z',
                    $Roles: [
                      {
                        $name: 'Configuration'
                      },
                      {
                        $name: 'Exploitation'
                      }
                    ],
                    $ManagementAreas: []
                }
        } */
        res.status(StatusCodes.CREATED).json(user);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.post("/filter", (req, res) => {
    // #swagger.summary = 'get list of users from filters'
    (async () => {
      try {
        const filters: UserFilter = req.body;
        /*  #swagger.parameters['filters'] = {
                in: 'body',
                description: 'filters',
                schema: {
                  name: 'string',
                  roles: [1, 2, 3],
                }
        } */
        const users = await service.retrieveUsersByFilters(filters);
        /* #swagger.responses[200] = {
                description: 'Returned users',
                schema: [{
                    $id: 1,
                    $name: 'xtvision',
                    $description: 'Default user',
                    $language: 'fr',
                    $time_zone: 'UTC+1',
                    $createdAt: '2022-08-05T10:04:24.651Z',
                    $updatedAt: '2022-08-05T10:04:24.651Z',
                    $Roles: [
                      {
                        $name: 'Configuration'
                      },
                      {
                        $name: 'Exploitation'
                      }
                    ],
                    $ManagementAreas: []
                }      ]
        } */
        res.status(StatusCodes.OK).json(users);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.delete("/:id", (req, res) => {
    // #swagger.summary = 'delete a user'
    (async () => {
      try {
        const id = req.params.id;
        /*  #swagger.parameters['id'] = {
                in: 'path',
                type: 'integer',
                description: 'user ID.' } */
        await service.deleteOneUser(id);
        res.sendStatus(StatusCodes.OK);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.post("/linkRoles", (req, res) => {
    // #swagger.summary = 'link a user with n roles'
    (async () => {
      try {
        const roleUser = req.body;
        /*  #swagger.parameters['NewRoleUser'] = {
          in: 'body',
          description: 'role id and user id',
          schema: [{
            $RoleId: 1,
            $UserId: 1,
                }]
              } */
        await service.addRoles(roleUser);
        res.sendStatus(StatusCodes.CREATED);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.post("/linkDashboards", (req, res) => {
    // #swagger.summary = 'link a user with n dashboards'
    (async () => {
      try {
        const dashboardUser = req.body;
        /*  #swagger.parameters['NewDashboardUser'] = {
          in: 'body',
          description: 'dashboard id and user id',
          schema: [{
            $DashboardId: 1,
            $UserId: 1,
          }]
        } */
        await service.addDashboards(dashboardUser);
        res.sendStatus(StatusCodes.CREATED);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.post("/linkManagementAreas", (req, res) => {
    // #swagger.summary = 'link a user with n managementAreas'
    (async () => {
      try {
        const managementAreaUser = req.body;
        /*  #swagger.parameters['NewManagementAreaUser'] = {
          in: 'body',
          description: 'managementArea id and user id',
          schema: [{
            $ManagementAreaId: 1,
            $UserId: 1,
          }]
        } */
        await service.addManagementAreas(managementAreaUser);
        res.sendStatus(StatusCodes.CREATED);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.post("/linkCategories", (req, res) => {
    // #swagger.summary = 'link a user with n categories'
    (async () => {
      try {
        const categoryUser = req.body;
        /*  #swagger.parameters['NewCategoryUser'] = {
          in: 'body',
          description: 'category id and user id',
          schema: [{
            $CategoryId: 1,
            $UserId: 1,
          }]
        } */
        await service.addCategories(categoryUser);
        res.sendStatus(StatusCodes.CREATED);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  return router;
};
