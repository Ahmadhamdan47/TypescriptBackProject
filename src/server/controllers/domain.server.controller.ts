import express from "express";
import { Server } from "http";
import { StatusCodes } from "http-status-codes";
import { logger } from "../../../logger";
import { DomainServerService } from "../services/domain.server.service";
import {
  permissionsConstants,
  requirePermissions,
} from "../middlewares/permissions.server.middleware";

export const domainServerController = (server: Server) => {
  const service = new DomainServerService(server);

  const router = express.Router();
  router.use(express.json());

  router.get(
    "/",
    requirePermissions(permissionsConstants.DOMAINS.READ),
    (req, res) => {
      // #swagger.summary = 'get all domains'
      (async () => {
        try {
          const domains = await service.getDomains();
          /* #swagger.responses[200] = {
            description: 'Returned domains',
            schema: [{
              $id: 1,
              $name: 'string',
              $domainSystemId: 4,
              $parentDomainSystemId: 2,
              $systemId: 1,
            }      ]
          } */
          res.status(StatusCodes.OK).json(domains);
        } catch (err) {
          logger.error("error while retrieving all domains! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.get(
    "/:id",
    requirePermissions(permissionsConstants.DOMAINS.READ),
    (req, res) => {
      // #swagger.summary = 'get domain from id'
      (async () => {
        try {
          const id = req.params.id;
          /* #swagger.parameters['id'] = {
                in: 'path',
                type: 'integer',
                description: 'domain ID.' } */
          const domain = await service.getDomain(id);
          res.status(StatusCodes.OK).json(domain);
          /* #swagger.responses[200] = {
                  description: 'Returned domain',
                  schema: [{
                    $id: 1,
                    $name: 'string',
                    $domainSystemId: 4,
                    $parentDomainSystemId: 2,
                    $systemId: 1,
                }      ]
          } */
        } catch (err) {
          logger.error("error while retrieving domain! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  return router;
};
