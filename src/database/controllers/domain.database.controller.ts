import express from "express";
import { Server } from "http";
import { logger } from "../../../logger";
import { StatusCodes } from "http-status-codes";
import { DomainDatabaseService } from "../services/domain.database.service";
import { DomainDatabaseInterface } from "../interfaces/domain.database";

export const domainDatabaseController = (server: Server) => {
  const service = new DomainDatabaseService(server);

  const router = express.Router();
  router.use(express.json());

  router.get("/", (req, res) => {
    // #swagger.summary = 'get all domains or domains from systemId'
    (async () => {
      try {
        const systemId = req.query.systemId;
        /*  #swagger.parameters['systemId'] = {
          in: 'query',
          type: 'integer',
          description: 'system ID.' } */
        const domains = await service.retrieveAllDomains(systemId);
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
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.get("/filterOne", (req, res) => {
    // #swagger.summary = 'get one domain by domainSystemId and systemId'
    (async () => {
      try {
        const domainSystemId = req.query.domainSystemId;
        /*  #swagger.parameters['domainSystemId'] = {
          in: 'query',
          type: 'integer',
          description: 'domain system ID.' } */
        const systemId = req.query.systemId;
        /*  #swagger.parameters['systemId'] = {
          in: 'query',
          type: 'integer',
          description: 'system ID.' } */
        const domain =
          await service.retrieveOneDomainByDomainSystemIdAndSystemId(
            domainSystemId,
            systemId
          );
        /* #swagger.responses[200] = {
          description: 'Returned domain',
          schema: {
            $id: 1,
            $name: 'string',
            $domainSystemId: 4,
            $parentDomainSystemId: 2,
            $systemId: 1,
          }
        } */
        res.status(StatusCodes.OK).json(domain);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.get("/:id", (req, res) => {
    // #swagger.summary = 'get one domain by id '
    (async () => {
      try {
        const id = req.params.id;
        /*  #swagger.parameters['id'] = {
            in: 'path',
            type: 'integer',
            description: 'domain ID.' } */
        const domain = await service.retrieveOneDomain(id);
        /* #swagger.responses[200] = {
            description: 'Returned domain',
            schema: {
              $id: 1,
              $name: 'string',
              $domainSystemId: 4,
              $parentDomainSystemId: 2,
              $systemId: 1,
            }
          } */
        res.status(StatusCodes.OK).json(domain);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.post("/", (req, res) => {
    // #swagger.summary = 'create one or a list of domains'
    (async () => {
      try {
        // TODO : make like other swagger comments
        if (req.body instanceof Array) {
          const domains = req.body as DomainDatabaseInterface[];
          res
            .status(StatusCodes.CREATED)
            .json(await service.createDomains(domains));
        } else {
          res
            .status(StatusCodes.CREATED)
            .json(
              await service.createOneDomain(req.body as DomainDatabaseInterface)
            );
        }
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.delete("/", (req, res) => {
    // #swagger.summary = 'delete all domains'
    (async () => {
      try {
        await service.deleteAllDomains();
        res.sendStatus(StatusCodes.OK);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.delete("/:id", (req, res) => {
    // #swagger.summary = 'delete one domain by id '
    (async () => {
      try {
        const id = req.params.id;
        /*  #swagger.parameters['id'] = {
            in: 'path',
            type: 'integer',
            description: 'domain ID.' } */
        await service.deleteOneDomain(id);
        res.sendStatus(StatusCodes.OK);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });
  return router;
};
