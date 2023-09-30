import express, { Express } from "express";
import http from "http";
import https from "https";
import { logger } from "../../logger";
import { credentials } from "../../src/webServer";
import { isHttpS } from "../../src/server/resources/config";
import { StatusCodes } from "http-status-codes";

export class WebServerTestOAuth2 {
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
    app.use((req, res) => {
      res.status(StatusCodes.OK).json({
        token_type: "Bearer",
        access_token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Inh0dmlzaW9uIiwiaWF0IjoxNjYzODM2MDQ1fQ.KcGXB46s9KwvaM8b4xt2xV5ax8Eqnah4ffOiyER5gI8",
      });
    });
  }

  start(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.init();
      if (isHttpS) {
        this.httpsServer.once("error", err => {
          logger.error(err);
          reject(err);
        });
        this.httpsServer.listen(8081, () => {
          logger.info(
            "OAuth2 https test server started with success on port 8081"
          );
          resolve();
        });
      } else {
        this.httpServer.once("error", err => {
          logger.error(err);
          reject(err);
        });
        this.httpServer.listen(8081, () => {
          logger.info(
            "OAuth2 http test server started with success on port 8081"
          );
          resolve();
        });
      }
    });
  }

  stop(): Promise<void> {
    logger.info("about to stop the OAuth2 test server");
    return new Promise((resolve, reject) => {
      if (isHttpS) {
        this.httpsServer.close(err => {
          if (err) {
            reject(err);
            return;
          }
          logger.info("OAuth2 https test server stopped with success.");
          resolve();
        });
      } else {
        this.httpServer.close(err => {
          if (err) {
            reject(err);
            return;
          }
          logger.info("OAuth2 http test server stopped with success.");
          resolve();
        });
      }
    });
  }
}
