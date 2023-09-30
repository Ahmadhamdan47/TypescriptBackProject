import express from "express";
import { Server } from "http";
import { logger } from "../../../logger";
import { BackupDatabaseObject } from "../../server/interfaces/backupDatabaseObject.server";
import { StatusCodes } from "http-status-codes";
import { RestoreDatabaseObject } from "../../server/interfaces/restoreDatabaseObject.server";
import { DatabaseService } from "../services/database.service";

export const databaseController = (server: Server) => {
  const service = new DatabaseService(server);

  const router = express.Router();
  router.use(express.json());

  router.post("/restore/:backupLocationType", (req, res) => {
    // #swagger.summary = 'Restore a database'
    (async () => {
      try {
        const restoreDatabaseObject: RestoreDatabaseObject = req.body;
        /*  #swagger.parameters['restoreDatabaseObject'] = {
                in: 'body',
                description: 'name and location to restore database',
                schema: {
                      $backupName: 'string'
                }
        } */
        const backupLocationType = req.params.backupLocationType;
        /*  #swagger.parameters['backupLocationType'] = {
                in: 'path',
                description: 'location type to restore database',
                schema: {
                      $backupLocationType: 'string'
                }
        } */
        await service.restore(
          restoreDatabaseObject.backupName,
          backupLocationType
        );
        res.sendStatus(StatusCodes.OK);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.post("/backup/:backupLocationType", (req, res) => {
    // #swagger.summary = 'Backup a database'
    (async () => {
      try {
        const backupDatabaseObject: BackupDatabaseObject = req.body;
        /*  #swagger.parameters['backupDatabaseObject'] = {
                in: 'body',
                description: 'name and location to backup database',
                schema: {
                      $dbName: 'string',
                      $backupName: 'string',
                      description:'string'
                }
        } */
        const backupLocationType = req.params.backupLocationType;
        /*  #swagger.parameters['backupLocationType'] = {
                in: 'path',
                description: 'location type to backup database',
                schema: {
                      $backupLocationType: 'string'
                }
        } */
        await service.backup(backupDatabaseObject, backupLocationType);
        res.sendStatus(StatusCodes.OK);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });
  return router;
};
