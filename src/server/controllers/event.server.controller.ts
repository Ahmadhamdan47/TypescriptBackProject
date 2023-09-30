import express from "express";
import { Server } from "http";
import { logger } from "../../../logger";
import { StatusCodes } from "http-status-codes";
import { EventFilter } from "../interfaces/eventsFilter";
import { EventServerService } from "../services/event.server.service";
import {
  permissionsConstants,
  requirePermissions,
} from "../middlewares/permissions.server.middleware";

export const eventServerController = (server: Server) => {
  const service = new EventServerService(server);

  const router = express.Router();
  router.use(express.json());

  router.get(
    "/",
    requirePermissions(permissionsConstants.EVENTS.READ),
    (req, res) => {
      // #swagger.summary = 'get all events'
      (async () => {
        try {
          const events = await service.getEvents();
          /* #swagger.responses[200] = {
            description: 'Returned events',
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
          logger.error("error while retrieving events! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.post(
    "/filter",
    requirePermissions(permissionsConstants.EVENTS.READ),
    (req, res) => {
      // #swagger.summary = 'get events by filter'
      (async () => {
        try {
          const filters: EventFilter = req.body;
          /*  #swagger.parameters['filters'] = {
                in: 'body',
                description: 'filter events  by timestamp, type, equipment and/or equipmentProperty',
                schema: {
                      $timestamp: 'date',
                      $stateName: 'string',
                      $equipmentName: 'string',
                      $equipmentProperty: 'string'
                }
        } */
          const events = await service.getEventsByFilter(filters);
          res.status(StatusCodes.OK).json(events);
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
        } catch (err) {
          logger.error("error while retrieving events with filters! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  return router;
};
