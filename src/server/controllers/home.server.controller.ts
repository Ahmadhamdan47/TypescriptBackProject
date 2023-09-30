import express from "express";
import { Server } from "http";
import { HomeServerService } from "../services/home.server.service";
import { logger } from "../../../logger";
import { StatusCodes } from "http-status-codes";
import { prefs } from "../../webServer";
import path from "path";
import { reconnectToSystemsFromDb } from "../services/system.server.service";

export const homeServerController = (server: Server) => {
  const service = new HomeServerService(server);

  const router = express.Router();
  router.use(express.json());

  router.post("/", (req, res) => {
    // #swagger.summary = 'Get datas for the user connected to show pages allowed'
    (async () => {
      try {
        const code = req.query.code;
        /* #swagger.parameters['code'] = {
              in: 'query',
              type: 'string',
              description: 'code from OAuth2' } */
        const config = await service.homePageConfig(code);
        /* #swagger.responses[200] = {
          description: 'Returned datas for the user connected to show pages allowed',
          schema: {
            $access_token: 'string',
            refresh_token: 'string',
            id_token: 'string',
            $username: 'username',
            $language: 'string',
            $time_zone: 'string',
            $features:[ 'string' ]
          }      
        } */
        res.status(StatusCodes.OK).json(config);
      } catch (err) {
        logger.error("error while retrieving config! ", err);
        res.sendStatus(StatusCodes.UNAUTHORIZED);
      }
    })();
  });

  router.post("/subscribeSystems", (req, res) => {
    // #swagger.summary = 'At start, reconnect systems and init Web Socket connection to systems if they exist (to get events)'
    (async () => {
      try {
        await reconnectToSystemsFromDb();
        res.sendStatus(StatusCodes.OK);
      } catch (err) {
        logger.error("error while reconnecting systems! ", err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.get("/refreshToken/:refreshToken", (req, res) => {
    // #swagger.summary = 'Get new tokens from refresh token for the user connected'
    (async () => {
      try {
        const refreshToken = req.params.refreshToken;
        /* #swagger.parameters['refreshToken'] = {
              in: 'path',
              type: 'string',
              description: 'refresh token from OAuth2' } */
        const tokens = await service.homePageRefreshToken(refreshToken);
        if (tokens) res.status(StatusCodes.OK).json(tokens);
        else
          res.status(StatusCodes.UNAUTHORIZED).send(prefs.auth_authorize_url);
        /* #swagger.responses[200] = {
              description: 'Get new tokens from refresh token for the user connected',
              schema: {
                $access_token: 'string',
                refresh_token: 'string',
                id_token: 'string'
              }      
      } */
      } catch (err) {
        logger.error("error while refreshing token! ", err);
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .send(prefs.auth_authorize_url);
      }
    })();
  });

  router.get("/*", function (req, res) {
    res.sendFile(
      path.resolve(__dirname, "../../client/dist/index.html"),
      err => {
        if (err) {
          logger.error("error while retrieving index.html! ", err);
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
        }
      }
    );
  });

  router.delete("/", (req, res) => {
    // #swagger.summary = 'User logout'
    (async () => {
      try {
        const headers = req.headers;
        /* #swagger.parameters['headers'] = {
              in: 'headers',
              type: 'string',
              description: 'headers from OAuth2' } */
        res.status(StatusCodes.OK).send(await service.homePageLogout(headers));
      } catch (err) {
        logger.error("error while logout! ", err);
        res.sendStatus(StatusCodes.UNAUTHORIZED);
      }
    })();
  });
  return router;
};
