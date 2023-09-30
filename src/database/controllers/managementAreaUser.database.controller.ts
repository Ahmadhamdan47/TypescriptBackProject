import express from "express";
import { Server } from "http";
import { logger } from "../../../logger";
import { StatusCodes } from "http-status-codes";
import { NewManagementAreaUser } from "../interfaces/managementAreaUser.database";
import { ManagementAreaUserDatabaseService } from "../services/managementAreaUser.database.service";

export const managementareaUserDatabaseController = (server: Server) => {
  const service = new ManagementAreaUserDatabaseService(server);

  const router = express.Router();
  router.use(express.json());

  router.get("/", (req, res) => {
    // #swagger.summary = 'get all managementareas and users linked'
    (async () => {
      try {
        const managementareaId = req.query.managementareaId;
        /*  #swagger.parameters['managementareaId'] = {
          in: 'query',
          type: 'integer',
          description: 'managementarea ID.' } */
        const userId = req.query.userId;
        /*  #swagger.parameters['userId'] = {
          in: 'query',
          type: 'integer',
          description: 'user ID.' } */
        const managementareaUsers =
          await service.retrieveAllManagementAreasUsers(
            managementareaId,
            userId
          );
        /* #swagger.responses[200] = {
            description: 'Returned managementareas ids and users ids linked',
            schema: [{
              $UserId: 1,
              $ManagementAreaId: 2,
            }      ]
          } */
        res.status(StatusCodes.OK).json(managementareaUsers);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.post("/usersIds", (req, res) => {
    // #swagger.summary = 'get all users ids from managementareas ids'
    (async () => {
      try {
        const managementareasIds = req.body;
        /*  #swagger.parameters['managementareasIds'] = {
          in: 'body',
          description: 'managementareas ids',
          schema: [1, 2, 3]
        } */
        const userIds = await service.retrieveAllUsersIdsFromManagementAreasIds(
          managementareasIds
        );
        /* #swagger.responses[200] = {
            description: 'Returned managementareas ids and users ids linked',
            schema: [1,2]
        } */
        res.status(StatusCodes.OK).json(userIds);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.post("/", (req, res) => {
    // #swagger.summary = 'create a list of users ids and managementareas ids linked'
    (async () => {
      try {
        const newManagementAreasUsers: NewManagementAreaUser[] = req.body;
        /*  #swagger.parameters['managementareasUsers'] = {
          in: 'body',
          description: 'managementareas ids and users ids linked',
          schema: [{
            $ManagementAreaId: 1,
            $UserId: 2,
          }       ]
        } */
        const managementAreasUsers = await service.createManagementAreasUsers(
          newManagementAreasUsers
        );
        /* #swagger.responses[200] = {
            description: 'Returned managementareas ids and users ids linked',
            schema: [{
              $ManagementAreaId: 1,
              $UserId: 2,
            }      ]
          } */
        res.status(StatusCodes.CREATED).json(managementAreasUsers);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  return router;
};
