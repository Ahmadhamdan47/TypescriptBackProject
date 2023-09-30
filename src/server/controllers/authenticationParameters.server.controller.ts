import express from "express";
import { Server } from "http";
import { logger } from "../../../logger";
import { StatusCodes } from "http-status-codes";
import { AuthenticationParametersServerService } from "../services/authenticationParameters.server.service";
import { AUTH_MODE } from "../resources/constants";
import {
  permissionsConstants,
  requirePermissions,
} from "../middlewares/permissions.server.middleware";
import { AuthenticationParametersServerInterface } from "../interfaces/authenticationParameters.server";

export const authenticationParametersServerController = (
  authenticationParameters: Server
) => {
  const service = new AuthenticationParametersServerService(
    authenticationParameters
  );

  const router = express.Router();
  router.use(express.json());

  router.get(
    "/",
    requirePermissions(permissionsConstants.AUTHENTICATION_PARAMETERS.READ),
    (req, res) => {
      // #swagger.summary = 'get all authentication parameters'
      (async () => {
        try {
          const authenticationParameters =
            await service.getAuthenticationParameters();
          /* #swagger.responses[200] = {
            description: 'Returned authentication parameters',
            schema: {
              $mode: 'string',
              authorize_url: 'string',
              token_url: 'string',
              authenticate_url: 'string',
              logout_url: 'string',
              users_url: 'string',
              client_id: 'string',
              redirect_uri: 'string',
              client_secret: 'string',
              admin_client_id: 'string',
              admin_client_secret: 'string',
              token_username_key: 'string',
              token_username_split: 'string',
              ad_url: 'string',
              ad_base_dn: 'string',
              ad_username: 'string',
              ad_password: 'string',
            }  
          } */
          res.status(StatusCodes.OK).json(authenticationParameters);
        } catch (err) {
          logger.error(
            "error while retrieving all authentication parameters! ",
            err
          );
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.get(
    "/mode",
    requirePermissions(permissionsConstants.AUTHENTICATION_PARAMETERS.READ),
    (req, res) => {
      // #swagger.summary = 'get auth mode list'
      (async () => {
        try {
          const mode = Object.values(AUTH_MODE);
          /* #swagger.responses[200] = {
            description: 'Returned auth mode list',
            schema: ['string']
          } */
          res.status(StatusCodes.OK).json(mode);
        } catch (err) {
          logger.error("error while retrieving auth mode list! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.put(
    "/",
    requirePermissions(permissionsConstants.AUTHENTICATION_PARAMETERS.UPDATE),
    (req, res) => {
      // #swagger.summary = 'update authentication parameters'
      (async () => {
        try {
          const authenticationParameters: AuthenticationParametersServerInterface =
            req.body;
          /* #swagger.parameters['authenticationParameters'] = {
                    in: 'body',
                    description: 'authentication parameters object',
                    schema: {
                            mode: 'string',
                            authorize_url: 'string',
                            token_url: 'string',
                            authenticate_url: 'string',
                            logout_url: 'string',
                            users_url: 'string',
                            client_id: 'string',
                            redirect_uri: 'string',
                            client_secret: 'string',
                            admin_client_id: 'string',
                            admin_client_secret: 'string',
                            token_username_key: 'string',
                            token_username_split: 'string',
                            ad_url: 'string',
                            ad_base_dn: 'string',
                            ad_username: 'string',
                            ad_password: 'string',
                    }
            } */
          await service.updateAuthenticationParameters(
            authenticationParameters
          );
          res.sendStatus(StatusCodes.OK);
        } catch (err) {
          logger.error("error while updating authentication parameters! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  return router;
};
