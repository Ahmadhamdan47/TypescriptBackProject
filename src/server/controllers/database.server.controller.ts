import express from "express";
import { StatusCodes } from "http-status-codes";
import { Server } from "http";
import { logger } from "../../../logger";
import { DatabaseServerService } from "../services/database.server.service";
import { BackupDatabaseObject } from "../interfaces/backupDatabaseObject.server";
import {
  createZipArchive,
  uploadFile,
} from "../middlewares/manageFiles.server.middleware";
import { BACKUP_LOCATIONS } from "../resources/constants";
import fs from "fs";
import {
  permissionsConstants,
  requirePermissions,
} from "../middlewares/permissions.server.middleware";
import { RestoreDatabaseObject } from "../interfaces/restoreDatabaseObject.server";

export const databaseServerController = (server: Server) => {
  const service = new DatabaseServerService(server);

  const router = express.Router();
  router.use(express.json());

  router.post(
    "/restore",
    requirePermissions(permissionsConstants.DATABASE.RESTORE),
    (req, res) => {
      // #swagger.summary = 'Restore a database'
      (async () => {
        try {
          const restoreDatabaseObject: RestoreDatabaseObject = req.body;
          /*  #swagger.parameters['restoreDatabaseObject'] = {
            in: 'body',
            description: 'infos to restore database',
            schema: {
              $backupName: 'string'
            }
          } */
          await service.restoreDatabase(restoreDatabaseObject);
          res.sendStatus(StatusCodes.OK);
        } catch (err) {
          logger.error("error while restoring database! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.post(
    "/backup",
    requirePermissions(permissionsConstants.DATABASE.BACKUP),
    (req, res) => {
      // #swagger.summary = 'Backup a database'
      const backupDatabaseObject: BackupDatabaseObject = req.body;
      (async () => {
        try {
          await service.backupDatabase(backupDatabaseObject);
          /*  #swagger.parameters['backupDatabaseObject'] = {
                in: 'body',
                description: 'infos to backup database',
                schema: {
                      $dbName: 'string',
                      $backupName: 'string',
                      $description:'string'
                }
        } */
          res.sendStatus(StatusCodes.OK);
        } catch (err) {
          logger.error("error while backing up database! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.get(
    "/dbNames",
    requirePermissions(permissionsConstants.DATABASE.READ),
    (req, res) => {
      // #swagger.summary = 'Get all databases names'
      (async () => {
        try {
          const databases = await service.getDatabasesNames();
          /* #swagger.responses[200] = {
            description: 'Returned databases names',
            schema: {
              $dbNameConfig: 'string',
              $dbNameExploit: 'string',
            }
          } */
          res.status(StatusCodes.OK).json(databases);
        } catch (err) {
          logger.error("error while retrieving all databases names! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.get(
    "/backupNames/:type",
    requirePermissions(permissionsConstants.DATABASE.READ),
    (req, res) => {
      // #swagger.summary = 'Get all backups names in manual or scheduled folder'
      (async () => {
        try {
          const type = req.params.type;
          /* #swagger.parameters['type'] = {
                in: 'path',
                type: 'string',
                description: 'manual or scheduled folder' } */
          const databases = await service.getBackupsNamesSortByDate(type);
          /* #swagger.responses[200] = {
            description: 'Returned backups names',
            schema: [{
              $name: 'string',
              $creationDate: Date,
              $size: 1000
            }      ]
          } */
          res.status(StatusCodes.OK).json(databases);
        } catch (err) {
          logger.error("error while retrieving all backups names! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.post(
    "/upload",
    requirePermissions(permissionsConstants.DATABASE.UPLOAD),
    uploadFile.single("file"),
    (req, res) => {
      // #swagger.summary = 'upload a backup file to manual folder'
      (async () => {
        try {
          if (req.file == undefined) {
            return res
              .status(StatusCodes.BAD_REQUEST)
              .send({ message: "Please upload a file!" });
          }
          res.status(StatusCodes.OK).send({
            message: `Uploaded the file successfully: ${req.file.originalname}`,
          });
        } catch (err) {
          logger.error(`Could not upload the file: ${req.file?.originalname}.`);
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            message: `Could not upload the file: ${req.file?.originalname}. ${err}`,
          });
        }
      })();
    }
  );

  router.get(
    "/files/:type/:fileNames",
    requirePermissions(permissionsConstants.DATABASE.READ),
    (req, res) => {
      // #swagger.summary = 'download zip archive with selected files in manual or scheduled folder'
      const fileNames: string[] = req.params.fileNames.split(",");
      /* #swagger.parameters['fileNames'] = {
                in: 'path',
                type: 'string',
                description: 'file names' } */
      try {
        const outputFile = `${req.params.type}_backupFiles.zip`;
        createZipArchive(
          BACKUP_LOCATIONS[req.params.type],
          BACKUP_LOCATIONS.root,
          outputFile,
          fileNames
        );
        res.download(`${BACKUP_LOCATIONS.root}${outputFile}`, err => {
          if (err) {
            logger.error(`Could not download the file.`);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
              message: "Could not download the file. " + err,
            });
          } else {
            // delete it on success
            fs.unlinkSync(`${BACKUP_LOCATIONS.root}${outputFile}`);
          }
        });
      } catch (err) {
        logger.error("File not found. ", err);
      }
    }
  );

  router.get(
    "/all/:type",
    requirePermissions(permissionsConstants.DATABASE.READ),
    (req, res) => {
      // #swagger.summary = 'download all files in manual or scheduled folder'
      try {
        const type = req.params.type;
        /* #swagger.parameters['type'] = {
                in: 'path',
                type: 'string',
                description: 'manual or scheduled folder' } */

        // verify that the folder is not empty
        if (fs.readdirSync(BACKUP_LOCATIONS[type]).length === 0) {
          logger.error(`folder is empty.`);
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            message: "folder is empty.",
          });
          return;
        }
        const outputFile = `${req.params.type}_backups.zip`;
        createZipArchive(
          BACKUP_LOCATIONS[req.params.type],
          BACKUP_LOCATIONS.root,
          outputFile
        );
        res.download(`${BACKUP_LOCATIONS.root}${outputFile}`, err => {
          if (err) {
            logger.error("Could not download files.");
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
              message: "Could not download the file. " + err,
            });
          } else {
            // delete it on success
            fs.unlinkSync(`${BACKUP_LOCATIONS.root}${outputFile}`);
          }
        });
      } catch (error) {
        logger.error("File not found. ", error);
      }
    }
  );

  router.delete(
    "/:backupNames",
    requirePermissions(permissionsConstants.DATABASE.DELETE),
    (req, res) => {
      // #swagger.summary = 'Delete a manual backup'
      (async () => {
        try {
          const backupNames = req.params.backupNames.split(",");
          /* #swagger.parameters['backupNames'] = {
                in: 'path',
                type: 'string',
                description: 'backup name' } */
          await service.deleteBackup(backupNames);
          res.sendStatus(StatusCodes.OK);
        } catch (err) {
          logger.error("err: ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  return router;
};
