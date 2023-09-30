import express, { Express } from "express";
import http from "http";
import https from "https";
import {
  newEquipment1,
  newEquipment2,
  newEquipment3,
  newEquipment4,
} from "../data/equipments.data";
import { newCastelSuiteSystem } from "../data/systems.data";
import {
  configMaylis,
  configXellip1,
  configXellip2,
} from "../data/equipmentsProperties.data";
import { logger } from "../../logger";
import {
  newEquipmentState1,
  newEquipmentState2,
  newEquipmentState3,
  newEquipmentState4,
} from "../data/currentEquipmentStates.data";
import { StatusCodes } from "http-status-codes";
import { domain2 } from "../data/domains.data";
import { credentials } from "../../src/webServer";
import { isHttpS } from "../../src/server/resources/config";

export class WebServerTestCastelSuite {
  app: Express;
  httpServer: http.Server;
  httpsServer: https.Server;

  constructor() {
    this.app = express();
    this.httpServer = http.createServer(this.app);
    this.httpsServer = https.createServer(credentials, this.app);
  }

  init() {
    const app = this.app;
    app.use(express.json());
    // Endpoints
    app.get("/CASTELSuite/xtvision/whoareyou", (req, res) => {
      res.send(newCastelSuiteSystem);
    });
    app.get("/CASTELSuite/xtvision/domains", (req, res) => {
      res.send([domain2]);
    });
    app.get("/CASTELSuite/xtvision/equipmentTypes/brands", (req, res) => {
      switch (req.query.equipmentType) {
        case "Xellip1":
          res.send(["Xellip1"]);
          break;
        case "Xellip2":
          res.send(["Xellip2"]);
          break;
        case "Maylis":
          res.send(["MaylisV1", "MaylisV2"]);
          break;
        default:
          res.end();
          break;
      }
    });
    app.get("/CASTELSuite/xtvision/equipmentTypes/list", (req, res) => {
      switch (req.query.equipmentType) {
        case "Xellip1":
          res.send([newEquipment1]);
          break;
        case "Xellip2":
          res.send([newEquipment2]);
          break;
        case "Maylis":
          res.send([newEquipment3, newEquipment4]);
          break;
        default:
          res.end();
          break;
      }
    });
    app.get("/CASTELSuite/xtvision/equipmentTypes/config", (req, res) => {
      switch (req.query.equipmentType) {
        case "Xellip1":
          res.send(configXellip1);
          break;
        case "Xellip2":
          res.send(configXellip2);
          break;
        case "Maylis":
          res.send(configMaylis);
          break;
        default:
          res.end();
          break;
      }
    });
    app.get("/CASTELSuite/xtvision/equipmentTypes/states", (req, res) => {
      switch (req.query.equipmentType) {
        case "Xellip1":
          res.send(newEquipmentState1);
          break;
        case "Xellip2":
          res.send(newEquipmentState2);
          break;
        case "Maylis":
          res.send([newEquipmentState3, newEquipmentState4]);
          break;
        default:
          res.end();
          break;
      }
    });
    app.post("/CASTELSuite/xtvision/equipmentsEvents", (req, res) => {
      if (req.body.subscribeEquipments || req.body.unsubscribeGids) {
        res.end();
      } else {
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    });
    app.post("/CASTELSuite/xtvision/equipments/:id", (req, res) => {
      if (req.params.id && req.body.actionType && req.body.params) {
        res.end();
      } else {
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    });
  }

  start(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.init();
      this.httpServer.once("error", err => {
        logger.error(err);
        reject(err);
      });
      if (isHttpS) {
        this.httpsServer.once("error", err => {
          logger.error(err);
          reject(err);
        });
        this.httpsServer.listen(5002, () => {
          logger.info(
            "CastelSuite https test server started with success on port 5002"
          );
          resolve();
        });
      } else {
        this.httpServer.listen(5002, () => {
          logger.info(
            "CastelSuite http test server started with success on port 5002"
          );
          resolve();
        });
      }
    });
  }

  stop(): Promise<void> {
    logger.info("about to stop the httpServer test CastelSuite");
    return new Promise((resolve, reject) => {
      if (isHttpS) {
        this.httpsServer.close(err => {
          if (err) {
            reject(err);
            return;
          }
          logger.info("CastelSuite https test server stopped with success.");
          resolve();
        });
      } else {
        this.httpServer.close(err => {
          if (err) {
            reject(err);
            return;
          }
          logger.info("CastelSuite http test server stopped with success.");
          resolve();
        });
      }
    });
  }
}
