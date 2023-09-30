import express from "express";
import { Server } from "http";
import { logger } from "../../../logger";
import { StatusCodes } from "http-status-codes";
import { AuthenticationParametersDatabaseService } from "../services/authenticationParameters.database.service";

export const authenticationParametersDatabaseController = (
  authenticationParameters: Server
) => {
  const service = new AuthenticationParametersDatabaseService(
    authenticationParameters
  );

  const router = express.Router();
  router.use(express.json());

  router.get("/", (req, res) => {
    // #swagger.summary = 'get all authentication parameters'
    (async () => {
      try {
        const authenticationParameters =
          await service.retrieveAllAuthenticationParameters();
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
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.put("/", (req, res) => {
    // #swagger.summary = 'update authentication parameters'
    (async () => {
      try {
        const parameters = req.body;
        /*  #swagger.parameters['parameter'] = {
          in: 'body',
          description: 'authentication parameters',
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
        await service.updateAuthenticationParameters(parameters);
        res.sendStatus(StatusCodes.OK);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  return router;
};
