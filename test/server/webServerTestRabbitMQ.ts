import express, { Express } from "express";
import http from "http";
import https from "https";
import { newRabbitMQSystem } from "../data/systems.data";
import { logger } from "../../logger";
import { StatusCodes } from "http-status-codes";
import {
  notifServerBindings,
  notifServerConnections,
} from "../data/notifBindingKeys.data";
import { credentials } from "../../src/webServer";
import { isHttpS } from "../../src/server/resources/config";

export class WebServerTestRabbitMQ {
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
    app.get("/api/connections", (req, res) => {
      res.send(notifServerConnections).end();
    });
    app.get("/api/overview", (req, res) => {
      res.send(newRabbitMQSystem).end();
    });

    app.get("/api/bindings/:vhost", (req, res) => {
      res.send(notifServerBindings).end();
    });

    app.post("/api/bindings/:vhost/e/:exchange/q/:queue", (req, res) => {
      res.sendStatus(StatusCodes.OK);
    });

    app.post("/api/exchanges/:vhost/:exchange/publish/", (req, res) => {
      res.send({ routed: true }).end();
    });

    app.put("/api/queues/:vhost/:queue", (req, res) => {
      res.sendStatus(StatusCodes.OK);
    });

    app.delete(
      "/api/bindings/:vhost/e/:exchange/q/:queue/:props",
      (req, res) => {
        res.sendStatus(StatusCodes.OK);
      }
    );
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
        this.httpsServer.listen(5003, () => {
          logger.info(
            "RabbitMQ https test server started with success on port 5003"
          );
          resolve();
        });
      } else {
        this.httpServer.once("error", err => {
          logger.error(err);
          reject(err);
        });
        this.httpServer.listen(5003, () => {
          logger.info(
            "RabbitMQ http test server started with success on port 5003"
          );
          resolve();
        });
      }
    });
  }

  stop(): Promise<void> {
    logger.info("about to stop the httpServer test RabbitMQ");
    return new Promise((resolve, reject) => {
      if (isHttpS) {
        this.httpsServer.close(err => {
          if (err) {
            reject(err);
            return;
          }
          logger.info("RabbitMQ https test server stopped with success.");
          resolve();
        });
      } else {
        this.httpServer.close(err => {
          if (err) {
            reject(err);
            return;
          }
          logger.info("RabbitMQ http test server  stopped with success.");
          resolve();
        });
      }
    });
  }
}
