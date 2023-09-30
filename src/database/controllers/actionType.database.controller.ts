import express from "express";
import { Server } from "http";
import { logger } from "../../../logger";
import { StatusCodes } from "http-status-codes";
import { ActionTypeDatabaseInterface } from "../interfaces/actionType.database";
import { ActionTypeDatabaseService } from "../services/actionType.database.service";

export const actionTypeDatabaseController = (server: Server) => {
  const service = new ActionTypeDatabaseService(server);

  const router = express.Router();
  router.use(express.json());

  router.get("/", (req, res) => {
    // #swagger.summary = 'get all action types '
    (async () => {
      try {
        const actionsTypes = await service.retrieveAllActionsTypes();
        /* #swagger.responses[200] = {
          description: 'Returned action types',
          schema: [{
            $id: '1',
            $name: 'string',
          }      ]
        } */
        res.status(StatusCodes.OK).json(actionsTypes);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.get("/:id", (req, res) => {
    // #swagger.summary = 'get one type action by id '
    (async () => {
      try {
        const id = req.params.id;
        /*  #swagger.parameters['id'] = {
          in: 'path',
          type: 'integer',
          description: 'type action ID.' } */
        const actionType = await service.retrieveOneActionType(id);
        /* #swagger.responses[200] = {
            description: 'Returned action type',
            schema: {
              $id: '1',
              $name: 'string',
            }
          } */
        res.status(StatusCodes.OK).json(actionType);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.post("/", (req, res) => {
    // #swagger.summary = 'create one or a list of action types'
    (async () => {
      try {
        // TODO : adapt to other swagger comments
        if (req.body instanceof Array) {
          res
            .status(StatusCodes.CREATED)
            .json(
              await service.createActionsTypes(
                req.body as ActionTypeDatabaseInterface[]
              )
            );
        } else {
          res
            .status(StatusCodes.CREATED)
            .json(
              await service.createOneActionType(
                req.body as ActionTypeDatabaseInterface
              )
            );
        }
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.post("/equipmentsPropertiesIds", (req, res) => {
    // #swagger.summary = 'get all action types from ids equipments properties'
    (async () => {
      try {
        const equipmentPropertyIds = req.body;
        /* #swagger.parameters['equipmentPropertyIds'] = {
              in: 'body',
              type: 'array',
              description: 'ids equipments properties' } */
        const states =
          await service.retrieveActionsTypesFromEquipmentsPropertiesIds(
            equipmentPropertyIds
          );
        /* #swagger.responses[200] = {
            description: 'Returned action types from ids equipments properties',
            schema: [{
              $id: 1,
              $name: 'string',
              $equipmentPropertyId : 2
            }      ]
          } */
        res.status(StatusCodes.OK).json(states);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.post("/filter", (req, res) => {
    // #swagger.summary = 'get all action types from ids'
    (async () => {
      try {
        const ids = req.body;
        /* #swagger.parameters['ids'] = {
              in: 'body',
              type: 'array',
              description: 'ids action types' } */
        const actionsTypes = await service.retrieveAllActionsTypesFromIds(ids);
        /* #swagger.responses[200] = {
          description: 'Returned action types from ids',
          schema: [{
            $id: '1',
            $name: 'string',
          }      ]
        } */
        res.status(StatusCodes.OK).json(actionsTypes);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.delete("/", (req, res) => {
    // #swagger.summary = 'delete action types from ids'
    (async () => {
      try {
        const ids = req.body;
        /* #swagger.parameters['ids'] = {
              in: 'body',
              type: 'array',
              description: 'ids action types' } */
        await service.deleteActionsTypesFromIds(ids);
        res.sendStatus(StatusCodes.OK);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  return router;
};
