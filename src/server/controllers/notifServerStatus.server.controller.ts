import express from "express";
import { Server } from "http";
import { logger } from "../../../logger";
import { StatusCodes } from "http-status-codes";
import { NotifServerStatusServerService } from "../services/notifServerStatus.server.service";

export const notifServerStatusServerController = (server: Server) => {
  const service = new NotifServerStatusServerService(server);

  const router = express.Router();
  router.use(express.json());

  // General comment for future development:
  // This controller and the associated service are currently only used to get the list of connected equipments (monitors by now) in a RabbitMQ server.
  // If need arises to get other information from the RabbitMQ server, this controller and service can be used to add more routes and methods.

  router.get("/:systemId", (req, res) => {
    // #swagger.summary = 'get all currently connected equipments in a RabbitMQ server '
    (async () => {
      try {
        const systemId = Number(req.params.systemId);
        /* #swagger.parameters['systemId'] = {
              in: 'path',
              type: 'integer',
              description: 'system ID.' } */
        const names = await service.getConnectionNames(systemId);
        /* #swagger.responses[200] = {
          description: 'Returned currently connected equipments',
          schema: {
            name: 'string'
          }
        }
      } */
        res.status(StatusCodes.OK).json(names);
      } catch (err) {
        logger.error(
          "error while retrieving currently connected equipments! ",
          err
        );
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  return router;
};
