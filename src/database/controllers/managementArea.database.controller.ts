import express from "express";
import { Server } from "http";
import { logger } from "../../../logger";
import { StatusCodes } from "http-status-codes";
import { ManagementAreaDatabaseService } from "../services/managementArea.database.service";

export const managementAreaDatabaseController = (server: Server) => {
  const service = new ManagementAreaDatabaseService(server);

  const router = express.Router();
  router.use(express.json());

  router.get("/", (req, res) => {
    // #swagger.summary = 'get all management areas'
    (async () => {
      try {
        const name = req.query.name;
        /*  #swagger.parameters['name'] = {
          in: 'query',
          type: 'string',
          description: 'management area name.' } */
        const username = req.query.username;
        /*  #swagger.parameters['username'] = {
          in: 'query',
          type: 'string',
          description: 'user name.' } */
        const managementAreas = await service.retrieveAllManagementAreas(
          name,
          username
        );
        /* #swagger.responses[200] = {
            description: 'Returned management areas',
            schema: [{
                $id: 1,
                $name: 'string',
                description: 'string'
            }      ]
        } */
        res.status(StatusCodes.OK).json(managementAreas);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.get("/:id", (req, res) => {
    // #swagger.summary = 'get one management area by id'
    (async () => {
      try {
        const id = req.params.id;
        /*  #swagger.parameters['id'] = {
          in: 'path',
          type: 'integer',
          description: 'management area ID.' } */
        const managementAreas = await service.retrieveOneManagementArea(id);
        /* #swagger.responses[200] = {
            description: 'Returned management area',
            schema: {
                $id: 1,
                $name: 'string',
                description: 'string'
            }
        } */
        res.status(StatusCodes.OK).json(managementAreas);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.post("/", (req, res) => {
    // #swagger.summary = 'create management area'
    (async () => {
      try {
        const newManagementArea = req.body;
        /*  #swagger.parameters['managementArea'] = {
                in: 'body',
                description: 'managementArea to add',
                schema: {
                      $name: 'string',
                      description: 'string'
                }
        } */
        const managementArea = await service.createOneManagementArea(
          newManagementArea
        );
        /* #swagger.responses[200] = {
                description: 'Returned management area',
                schema: {
                      $id: 1,
                      $name: 'string',
                      description: 'string'
                }
        } */
        res.status(StatusCodes.CREATED).json(managementArea);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.delete("/", (req, res) => {
    // #swagger.summary = 'delete all management areas'
    (async () => {
      try {
        await service.deleteAllManagementAreas();
        res.sendStatus(StatusCodes.OK);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.delete("/:id", (req, res) => {
    // #swagger.summary = 'delete one management area by id'
    (async () => {
      try {
        const id = req.params.id;
        /*  #swagger.parameters['id'] = {
          in: 'path',
          type: 'integer',
          description: 'management area ID.' } */
        await service.deleteOneManagementArea(id);
        res.sendStatus(StatusCodes.OK);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  /*----------------------------------------------
  |  LINKS
  ------------------------------------------------*/

  router.post("/linkUsers", (req, res) => {
    // #swagger.summary = 'link a managementArea with n users'
    (async () => {
      try {
        const managementAreaUsers = req.body;
        /*  #swagger.parameters['NewManagementAreaUser'] = {
          in: 'body',
          description: 'managementarea id and user id',
          schema: [{
            $ManagementAreaId: 1,
            $UserId: 1
          }]
        } */
        await service.addUsers(managementAreaUsers);
        res.sendStatus(StatusCodes.CREATED);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });
  return router;
};
