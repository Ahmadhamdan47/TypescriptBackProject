import express from "express";
import { Server } from "http";
import { logger } from "../../../logger";
import { StatusCodes } from "http-status-codes";
import { EventFilter } from "../../server/interfaces/eventsFilter";
import { EventDatabaseInterface } from "../interfaces/event.database";
import { EventDatabaseService } from "../services/event.database.service";

export const eventDatabaseController = (server: Server) => {
  const service = new EventDatabaseService(server);

  const router = express.Router();
  router.use(express.json());

  router.get("/", (req, res) => {
    // #swagger.summary = 'get all events '
    (async () => {
      try {
        const events = await service.retrieveAllEvents();
        /* #swagger.responses[200] = {
          description: 'Returned events',
          schema: [{
            id: 1,
            sequenceNumber: 5,
            timestamp: 'timestamp',
            equipmentProperty: 'equipmentProperty',
            equipmentName: 'string',
            stateName: 'string',
            systemId: 2,
            params: 'params',
          }      ]
        } */
        res.status(StatusCodes.OK).json(events);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.get("/:id", (req, res) => {
    // #swagger.summary = 'get one event by id '
    (async () => {
      try {
        const id = req.params.id;
        /*  #swagger.parameters['id'] = {
          in: 'path',
          type: 'integer',
          description: 'event ID.' } */
        const event = await service.retrieveOneEvent(id);
        /* #swagger.responses[200] = {
          description: 'Returned event',
          schema: {
            $id: 1,
            $sequenceNumber: 5,
            $timestamp: 'timestamp',
            $equipmentProperty: 'equipmentProperty',
            $equipmentName: 'string',
            $stateName: 'string',
            $systemId: 2,
            $params: 'params',
          }
        } */
        res.status(StatusCodes.OK).json(event);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.post("/", (req, res) => {
    // #swagger.summary = 'create one or a list of events'
    (async () => {
      try {
        // TODO : like other swagger comments
        if (req.body instanceof Array) {
          res
            .status(StatusCodes.CREATED)
            .json(
              await service.createEvents(req.body as EventDatabaseInterface[])
            );
        } else {
          res
            .status(StatusCodes.CREATED)
            .json(
              await service.createOneEvent(req.body as EventDatabaseInterface)
            );
        }
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.delete("/", (req, res) => {
    // #swagger.summary = 'delete all events '
    (async () => {
      try {
        await service.deleteAllEvents();
        res.sendStatus(StatusCodes.OK);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.delete("/:id", (req, res) => {
    // #swagger.summary = 'delete one event by id '
    (async () => {
      try {
        const id = req.params.id;
        /*  #swagger.parameters['id'] = {
          in: 'path',
          type: 'integer',
          description: 'event ID.' } */
        await service.deleteOneEvent(id);
        res.sendStatus(StatusCodes.OK);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.post("/filter", (req, res) => {
    // #swagger.summary = 'get events by filter'
    (async () => {
      try {
        const filters: EventFilter = req.body;
        /*  #swagger.parameters['filters'] = {
                in: 'body',
                description: 'filter events  by timestamp, type, equipment and/or equipmentProperty',
                schema: {
                      timestamp: 'date',
                      stateName: 'string',
                      equipmentName: 'string',
                      equipmentProperty: 'string'
                }
        } */
        const events = await service.retrieveEventsByFilters(filters);
        /* #swagger.responses[200] = {
          description: 'Returned events with filters',
          schema: [{
            $id: 1,
            $sequenceNumber: 5,
            $timestamp: 'timestamp',
            $equipmentProperty: 'equipmentProperty',
            $equipmentName: 'string',
            $stateName: 'string',
            $systemId: 2,
            $params: 'params',
          }      ]
        } */
        res.status(StatusCodes.OK).json(events);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  return router;
};
