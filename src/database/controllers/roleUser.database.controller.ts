import express from "express";
import { Server } from "http";
import { logger } from "../../../logger";
import { StatusCodes } from "http-status-codes";
import { RoleUserDatabaseService } from "../services/roleUser.database.service";

export const roleUserDatabaseController = (server: Server) => {
  const service = new RoleUserDatabaseService(server);

  const router = express.Router();
  router.use(express.json());

  router.get("/", (req, res) => {
    // #swagger.summary = 'get all roles and users linked'
    (async () => {
      try {
        const roleId = req.query.roleId;
        /*  #swagger.parameters['roleId'] = {
          in: 'query',
          type: 'integer',
          description: 'role ID.' } */
        const userId = req.query.userId;
        /*  #swagger.parameters['userId'] = {
          in: 'query',
          type: 'integer',
          description: 'user ID.' } */
        const roleUsers = await service.retrieveAllRolesUsers(roleId, userId);
        /* #swagger.responses[200] = {
          description: 'Returned roles ids and users ids linked',
          schema: [{
            $UserId: 1,
            $RoleId: 2,
          }      ]
        } */
        res.status(StatusCodes.OK).json(roleUsers);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.post("/usersIds", (req, res) => {
    // #swagger.summary = 'get all users ids from roles ids'
    (async () => {
      try {
        const ids = req.body;
        /*  #swagger.parameters['ids'] = {
          in: 'body',
          description: 'roles ids',
          schema: [1, 2, 3]
        } */
        const userIds = await service.retrieveAllUsersIdsFromRolesIds(ids);
        /* #swagger.responses[200] = {
            description: 'Returned users ids and roles ids linked',
            schema: [{
              $RoleId: 1,
              $UserId: 2,
            }      ]
          } */
        res.status(StatusCodes.OK).json(userIds);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.post("/", (req, res) => {
    // #swagger.summary = 'create a list of users ids and roles ids linked'
    (async () => {
      try {
        const roleUsers = req.body;
        /*  #swagger.parameters['NewRoleUser'] = {
          in: 'body',
          description: 'role id and user id',
          schema: [{
            $RoleId: 1,
            $UserId: 1
          }]
        } */
        await service.createRolesUsers(roleUsers);
        res.sendStatus(StatusCodes.CREATED);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  return router;
};
