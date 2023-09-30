import express from "express";
import { Server } from "http";
import { logger } from "../../../logger";
import { StatusCodes } from "http-status-codes";
import { StateDatabaseInterface } from "../interfaces/state.database";
import { StateDatabaseService } from "../services/state.database.service";

export const stateDatabaseController = (server: Server) => {
  const service = new StateDatabaseService(server);

  const router = express.Router();
  router.use(express.json());

  router.get("/", (req, res) => {
    // #swagger.summary = 'get all states or state from name'
    (async () => {
      try {
        const name = req.query.name;
        /*  #swagger.parameters['name'] = {
                in: 'query',
                type: 'string',
                description: 'state name.' } */
        const states = await service.retrieveAllStates(name);
        /* #swagger.responses[200] = {
          description: 'Returned states',
          schema: [{
            $id: '1',
            $name: 'string',
          }      ]
        } */
        res.status(StatusCodes.OK).json(states);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.get("/:id", (req, res) => {
    // #swagger.summary = 'get one state by id '
    (async () => {
      try {
        const id = req.params.id;
        /*  #swagger.parameters['id'] = {
          in: 'path',
          type: 'integer',
          description: 'state ID.' } */
        const state = await service.retrieveOneState(id);
        /* #swagger.responses[200] = {
            description: 'Returned state',
            schema: {
              $id: '1',
              $name: 'string',
            }
          } */
        res.status(StatusCodes.OK).json(state);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.post("/", (req, res) => {
    // #swagger.summary = 'create one or a list of states'
    (async () => {
      try {
        // TODO : swagger comment like other controllers
        if (req.body instanceof Array) {
          res
            .status(StatusCodes.CREATED)
            .json(
              await service.createStates(req.body as StateDatabaseInterface[])
            );
        } else {
          res
            .status(StatusCodes.CREATED)
            .json(
              await service.createOneState(req.body as StateDatabaseInterface)
            );
        }
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.post("/equipmentsPropertiesIds", (req, res) => {
    // #swagger.summary = 'get all states from equipments propertiesids '
    (async () => {
      try {
        const ids = req.body;
        /*  #swagger.parameters['ids'] = {
                in: 'body',
                description: 'equipments properties ids',
                schema: [1, 2, 3]
        } */
        const states = await service.retrieveStatesFromEquipmentsPropertiesIds(
          ids
        );
        /* #swagger.responses[200] = {
          description: 'Returned states from equipments properties ids',
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
    // #swagger.summary = 'get all states from ids'
    (async () => {
      try {
        const ids = req.body;
        /*  #swagger.parameters['ids'] = {
          in: 'body',
          description: 'states ids',
          schema: [1, 2, 3]
        } */
        const states = await service.retrieveAllStatesFromIds(ids);
        /* #swagger.responses[200] = {
          description: 'Returned states from ids',
          schema: [{
            $id: '1',
            $name: 'string',
          }      ]
        } */
        res.status(StatusCodes.OK).json(states);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.delete("/", (req, res) => {
    // #swagger.summary = 'delete states from ids'
    (async () => {
      try {
        const ids = req.body;
        /*  #swagger.parameters['ids'] = {
          in: 'body',
          description: 'states ids',
          schema: [1, 2, 3]
        } */
        await service.deleteStatesFromIds(ids);
        res.sendStatus(StatusCodes.OK);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  return router;
};
