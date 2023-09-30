import express from "express";
import { Server } from "http";
import { StatusCodes } from "http-status-codes";
import { NewGeneralUserAction } from "../interfaces/generalUserAction.database";
import { GeneralUserActionDatabaseService } from "../services/generalUserAction.database.service";
import { logger } from "../../../logger";

export const generalUserActionDatabaseController = (server: Server) => {
  const router = express.Router();
  router.use(express.json());
  const service = new GeneralUserActionDatabaseService(server);

  // Route to log user action
  router.post("/", (req, res) => {
    // #swagger.summary = 'log user action'
    (async () => {
      try {
        const generalUserAction: NewGeneralUserAction = req.body;
        /*  #swagger.parameters['generalUserAction'] = {
                in: 'body',
                description: 'user action to log',
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

        await service.logGeneralUserAction(generalUserAction);

        res.status(StatusCodes.CREATED).end();
      } catch (error) {
        logger.error("Error logging user action:", error);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });
  // Route to retrieve general user actions with pagination or without
  router.get("/", (req, res) => {
    // #swagger.summary = 'retrieve general user actions'
    (async () => {
      try {
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
        const result = await service.retrieveGeneralUserActions(pagination);
        res.status(StatusCodes.OK).json(result);
        /* #swagger.responses[200] = {
                description: 'Returned general user actions',
                schema: [{
                  id: 1,
                  username: 'username',
                  actionType: 'actionType',
                  actionObject: 'actionObject',
                  isSuccessful: true
                
                }]
      }*/
      } catch (error) {
        logger.error("Error retrieving general user actions:", error);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  // Route to retrieve general user actions by filters and with pagination or without
  router.post("/filter", (req, res) => {
    // #swagger.summary = 'retrieve general user actions by filters'
    (async () => {
      try {
        const filters = req.body;
        const pagination = {
          size: req.query.size,
          offset: req.query.offset,
        };
        const result = await service.retrieveGeneralUserActionsByFilter(
          filters,
          pagination
        );
        res.status(StatusCodes.OK).json(result);
      } catch (error) {
        logger.error(
          "Error retrieving general user actions by filters:",
          error
        );
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });
  router.delete("/", (req, res) => {
    // #swagger.summary = 'delete general user actions'
    (async () => {
      try {
        const { olderThan } = req.body;

        const olderThanDate = new Date(olderThan);

        await service.deleteGeneralUserActions(olderThanDate);
        /* #swagger.parameters['olderThan'] = {
              in: 'body',
              description: 'Purge actions older than date',
              required: true,
              type: 'integer',
      }*/

        res.sendStatus(StatusCodes.OK);
      } catch (error) {
        logger.error("Error deleting general user actions:", error);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });
  return router;
};
