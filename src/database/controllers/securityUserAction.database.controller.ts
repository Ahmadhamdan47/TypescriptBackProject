import express from "express";
import { Server } from "http";
import { StatusCodes } from "http-status-codes";
import { NewSecurityUserAction } from "../interfaces/securityUserAction.database";
import { SecurityUserActionDatabaseService } from "../services/securityUserAction.database.service";
import { logger } from "../../../logger";

export const securityUserActionDatabaseController = (server: Server) => {
  const router = express.Router();
  router.use(express.json());
  const service = new SecurityUserActionDatabaseService(server);

  // Route to log user action
  router.post("/", (req, res) => {
    // #swagger.summary = 'log security user action'
    (async () => {
      try {
        const securityUserAction: NewSecurityUserAction = req.body;
        /*  #swagger.parameters['securityUserAction'] = {
                in: 'body',
                description: 'security user action to log',
                schema: {
                  $actionType : 'string',
                  $actionObject : 'string',
                  $username : 'string',
                  $isSuccessful : 'boolean'
                  $description : 'string',
                  $param1 : 'string',
                  $param2 : 'string' 
                }
      }
      */

        await service.logSecurityUserAction(securityUserAction);

        res.status(StatusCodes.CREATED).end();
      } catch (error) {
        logger.error("Error logging user action:", error);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });
  router.get("/", (req, res) => {
    // #swagger.summary = 'retrieve security user actions'
    (async () => {
      try {
        const pagination = {
          size: req.query.size,
          offset: req.query.offset,
        };
        const result = await service.retrieveSecurityUserActions(pagination);
        res.status(StatusCodes.OK).json(result);
        /* #swagger.responses[200] = {
            id: 1,
            username: 'username',
            actionType: 'actionType',
            actionObject: 'actionObject',
            isSuccessful: true
        } */
      } catch (error) {
        logger.error("Error retrieving security user actions:", error);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  // Route to retrieve security user actions by filters and with pagination or without
  router.post("/filter", (req, res) => {
    // #swagger.summary = 'retrieve security user actions by filters'
    (async () => {
      try {
        const filters = req.body;
        const pagination = {
          /*  #swagger.parameters['pagination'] = {
                in: 'query',
                description: 'pagination',
                schema: {
                  page: 1,
                  size: 10,
                }
    
          }*/
          size: req.query.size,
          offset: req.query.offset,
        };
        const result = await service.retrieveSecurityUserActionsByFilter(
          filters,
          pagination
        );
        res.status(StatusCodes.OK).json(result);
      } catch (error) {
        logger.error(
          "Error retrieving security user actions by filters:",
          error
        );
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  return router;
};
