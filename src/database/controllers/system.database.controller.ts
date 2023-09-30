import express from "express";
import { Server as ServerHTTP } from "http";
import { logger } from "../../../logger";
import { StatusCodes } from "http-status-codes";
import { NewSystem } from "../interfaces/system.database";
import { SystemDatabaseService } from "../services/system.database.service";

export const systemDatabaseController = (server: ServerHTTP) => {
  const service = new SystemDatabaseService(server);

  const router = express.Router();
  router.use(express.json());

  router.get("/", (req, res) => {
    // #swagger.summary = 'get all systems'
    (async () => {
      try {
        const name = req.query.name;
        /*  #swagger.parameters['name'] = {
                in: 'query',
                description: 'system name',
                type: 'string'
        } */
        const servers = await service.retrieveAllSystems(name);
        res.status(StatusCodes.OK).json(servers);
        /* #swagger.responses[200] = {
                description: 'Returned systems',
                schema: [{
                    $id: 1,
                    $name: 'server',
                    $kind: 'type',
                    $brand: 'brand',
                    port : 'port',
                    $address: 'address',
                    $url_connexion_api: 'url_connexion_api',
                    $url_connexion_ws: 'url_connexion_ws',
                    $release: 'release',
                    $state: 'connected',
                    $createdBy: 'xtvision',
                    $createdAt : '01/01/2000',
                    $updatedBy : 'xtvision',
                    $updatedAt : '01/01/2000',
                    $user: 'string',
                    $authMode: 'string',
                    $password: 'string'
                }      ]
        } */
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.get("/:id", (req, res) => {
    // #swagger.summary = 'get one system by id'
    (async () => {
      try {
        const id = req.params.id;
        /*  #swagger.parameters['id'] = {
                in: 'path',
                description: 'system id',
                type: 'integer'
        } */
        const server = await service.retrieveOneSystem(id);
        /* #swagger.responses[200] = {
                description: 'Returned system',
                schema: {
                  $id: 1,
                    $name: 'server',
                    $kind: 'type',
                    $brand: 'brand',
                    port : 'port',
                    $address: 'address',
                    $url_connexion_api: 'url_connexion_api',
                    $url_connexion_ws: 'url_connexion_ws',
                    $release: 'release',
                    $state: 'connected',
                    $createdBy: 'xtvision',
                    $createdAt : '01/01/2000',
                    $updatedBy : 'xtvision',
                    $updatedAt : '01/01/2000',
                    $user: 'string',
                    $authMode: 'string',
                    $password: 'string'
                }
        } */
        res.status(StatusCodes.OK).json(server);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.post("/", (req, res) => {
    // #swagger.summary = 'create a system'
    (async () => {
      try {
        const newSystem = req.body as NewSystem;
        /*  #swagger.parameters['server'] = {
            in: 'body',
            description: 'new system object ',
            schema: {
                    $name: 'server',
                    $kind: 'type',
                    $brand: 'brand',
                    port : 'port',
                    $address: 'address',
                    $url_connexion_api: 'url_connexion_api',
                    $url_connexion_ws: 'url_connexion_ws',
                    $release: 'release',
                    $state: 'connected',
                    $createdBy: 'xtvision',
                    $updatedBy : 'xtvision',
                    $authMode: 'string',
                    $user: 'string',
                    $password: 'string'
            }
    } */
        const system = await service.createOneSystem(newSystem);
        /* #swagger.responses[201] = {
                description: 'Returned system',
                schema: {
                    $id: 1,
                    $name: 'server',
                    $kind: 'type',
                    $brand: 'brand',
                    port : 'port', 
                    $address: 'address',
                    $url_connexion_api: 'url_connexion_api',
                    $url_connexion_ws: 'url_connexion_ws',
                    $release: 'release',
                    $state: 'connected',
                    $createdBy: 'xtvision',
                    $createdAt : '01/01/2000',
                    $updatedBy : 'xtvision',
                    $updatedAt : '01/01/2000',
                    $authMode: 'string',
                    $user: 'string',
                    $password: 'string'
                }
        } */
        res.status(StatusCodes.CREATED).json(system);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.post("/filter", (req, res) => {
    // #swagger.summary = 'get list of systems from filters'
    (async () => {
      try {
        const filters = req.body;
        /*  #swagger.parameters['filters'] = {
                in: 'body',
                description: 'filters',
                schema: {
                  brand: 'string',
                  kind: 'string',
                }
        } */
        const systems = await service.retrieveSystemsByFilters(filters);
        /* #swagger.responses[200] = {
                description: 'Returned systems filtered',
                schema: [{
                    $id: 1,
                    $name: 'server',
                    $kind: 'type',
                    $brand: 'brand',
                    port : 'port', 
                    $address: 'address',
                    $url_connexion_api: 'url_connexion_api',
                    $url_connexion_ws: 'url_connexion_ws',
                    $release: 'release',
                    $state: 'connected',
                    $createdBy: 'xtvision',
                    $createdAt : '01/01/2000',
                    $updatedBy : 'xtvision',
                    $updatedAt : '01/01/2000',
                    $authMode: 'string',
                    $user: 'string',
                    $password: 'string'
                }      ]
        } */
        res.status(StatusCodes.OK).json(systems);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.put("/:id", (req, res) => {
    (async () => {
      try {
        const id = req.params.id;
        /*  #swagger.parameters['id'] = {
                in: 'path',
                description: 'system id',
                type: 'integer'
        } */
        const parameters = req.body;
        // TODO DGO
        /*  #swagger.parameters['parameters'] = {
                in: 'body',
                description: 'system parameters',
                schema: {
                    address: 'ip or dns',
                    kind: 'kind',
                    name: 'string',
                    port: 'port',
                    managementArea: 'managementArea',
                    category: 'category',
                    brand: 'brand',
                    createdBy: 'xtvision',
                    authMode : 'string',
                }
        } */
        await service.updateSystem(id, parameters);
        res.sendStatus(StatusCodes.OK);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.delete("/", (req, res) => {
    // #swagger.summary = 'delete all systems'
    (async () => {
      try {
        await service.deleteAllSystems();
        res.sendStatus(StatusCodes.OK);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.delete("/:id", (req, res) => {
    // #swagger.summary = 'delete one system by id'
    (async () => {
      try {
        const id = req.params.id;
        /*  #swagger.parameters['id'] = {
                in: 'path',
                description: 'system id',
                type: 'integer'
        } */
        await service.deleteOneSystem(id);
        res.sendStatus(StatusCodes.OK);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });
  return router;
};
