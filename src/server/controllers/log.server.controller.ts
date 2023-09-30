import express from "express";
import config from "../resources/config";
import { Server } from "http";
import fs from "fs";
import { logger } from "../../../logger";
import { StatusCodes } from "http-status-codes";
import {
  allLogsPath,
  createZipArchive,
  logsPath,
} from "../middlewares/manageFiles.server.middleware";
import {
  permissionsConstants,
  requirePermissions,
} from "../middlewares/permissions.server.middleware";

const baseUrl = config.xtvision.url + "/logs/";

export const logServerController = (server: Server) => {
  const router = express.Router();
  router.use(express.json());

  router.post("/", (req, res) => {
    // #swagger.summary = 'log a message'
    try {
      const log = req.body;
      /* #swagger.parameters['log'] = {
                in: 'body',
                description: 'log message',
                schema: {
                  $level: 'error|warn|info|http|debug',
                  $message: 'string',
                }
              } */
      logger.log(log.level, log.message);
      res.status(StatusCodes.OK).send("Logged successfully");
    } catch (error) {
      logger.error(`Error while logging: ${error}`);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: "Error while logging",
      });
    }
  });

  router.get(
    "/",
    requirePermissions(permissionsConstants.LOGS.READ),
    (req, res) => {
      try {
        // #swagger.summary = 'get a list of log filenames'
        const fileInfos = fs.readdirSync(allLogsPath).map(file => ({
          name: file,
          creationDate: fs.statSync(allLogsPath + file).birthtime,
          size: fs.statSync(allLogsPath + file).size,
        }));
        logger.info(`Filenames returned successfully`);
        res.status(StatusCodes.OK).send(fileInfos);
      } catch (error) {
        logger.error(`Error while retrieving filenames: ${error}`);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
          message: "Error while retrieving filenames",
        });
      }
    }
  );

  router.get(
    "/file/:name",
    requirePermissions(permissionsConstants.LOGS.READ),
    (req, res) => {
      try {
        const name = req.params.name;
        /* #swagger.parameters['name'] = {
                in: 'path',
                type: 'string',
                description: 'log file name' } */
        // #swagger.summary = 'download file by name'
        res.download(allLogsPath + name, err => {
          if (err) {
            logger.error("Could not download the file.");
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
              message: "Could not download the file. " + err,
            });
          }
        });
      } catch (error) {
        logger.error(`Error while retrieving file: ${error}`);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
          message: "Error while retrieving file",
        });
      }
    }
  );

  router.get(
    "/all",
    requirePermissions(permissionsConstants.LOGS.READ),
    (req, res) => {
      try {
        // #swagger.summary = 'download all files'
        const outputFile = "logs.zip";
        createZipArchive(allLogsPath, logsPath, outputFile);
        res.download(`${logsPath}${outputFile}`, err => {
          if (err) {
            logger.error("Could not download files.");
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
              message: "Could not download the file. " + err,
            });
          } else {
            fs.unlinkSync(`${logsPath}${outputFile}`);
          }
        });
      } catch (error) {
        logger.error(`Error while retrieving files: ${error}`);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
          message: "Error while retrieving files",
        });
      }
    }
  );

  router.get(
    "/files/:fileNames",
    requirePermissions(permissionsConstants.LOGS.READ),
    (req, res) => {
      // #swagger.summary = 'create zip archive with selected files, then download it and delete it on success'
      try {
        const fileNames: string[] = req.params.fileNames.split(",");
        /* #swagger.parameters['fileNames'] = {
                in: 'path',
                type: 'string',
                description: 'log file names' } */
        const outputFile = "logFiles.zip";
        createZipArchive(allLogsPath, logsPath, outputFile, fileNames);
        res.download(`${logsPath}${outputFile}`, err => {
          if (err) {
            logger.error(`Could not download the file.`);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
              message: "Could not download the file. " + err,
            });
          } else {
            fs.unlinkSync(`${logsPath}${outputFile}`);
          }
        });
      } catch (err) {
        logger.error(`file not found. ${err}`);
      }
    }
  );

  router.delete(
    "/files/:names",
    requirePermissions(permissionsConstants.LOGS.DELETE),
    (req, res) => {
      try {
        // #swagger.summary = 'delete file by name'
        const names: string[] = req.params.names.split(",");
        /* #swagger.parameters['fileNames'] = {
                  in: 'path',
                  type: 'string',
                  description: 'file names' } */
        names.forEach(name => {
          fs.unlinkSync(allLogsPath + name);
        });
        logger.info(`Deleted files successfully`);
        res.sendStatus(StatusCodes.OK);
      } catch (error) {
        logger.error(`Error while deleting files: ${error}`);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
          message: "Error while deleting files",
        });
      }
    }
  );

  router.delete(
    "/all",
    requirePermissions(permissionsConstants.LOGS.DELETE),
    (req, res) => {
      try {
        // #swagger.summary = 'delete all files'
        const names = fs
          .readdirSync(allLogsPath)
          .sort(
            (a: string, b: string) =>
              fs.statSync(allLogsPath + b).birthtime.getTime() -
              fs.statSync(allLogsPath + a).birthtime.getTime()
          );
        // Remove the first file (the most recent one) before deleting the rest
        names.slice(1).forEach(name => {
          fs.unlinkSync(allLogsPath + name);
        });
        logger.info(`Deleted files successfully`);
        res.sendStatus(StatusCodes.OK);
      } catch (error) {
        logger.error(`Error while deleting files: ${error}`);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
          message: "Error while deleting files",
        });
      }
    }
  );

  return router;
};
