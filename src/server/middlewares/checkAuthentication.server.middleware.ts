import { NextFunction, Request, Response } from "express";
import * as config from "../../database/config/config.json";
import { prefs, customAxios as axios } from "../../webServer";
import { logger } from "../../../logger";
import { StatusCodes } from "http-status-codes";
import { NODE_ENV_PROD, ASCII, BASE64, BASIC } from "../resources/constants";

// Check authentication token or credentials for each request
export const checkAuthentication = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Checks for backend url
  if (!req.url.includes("/database/")) {
    // No authentication for this url because it's the APIs to access the OAuth2/OIDC server
    if (!req.url.includes("/home")) {
      // Redirect to Front to get user infos with OAuth code
      if (req.url.includes("/callback") && req.query.code) {
        res.redirect("/?code=" + req.query.code);
      } else {
        // Check access token
        checkAccessToken(req, res, next);
      }
    } else {
      next();
    }
  } else {
    // Checks for Database URL
    checkDatabaseAuth(res, next, req.headers.authorization);
  }
};

/**
 * Check if token is valid or not. If valid, next middleware. If not, try to refresh this token or logout the user.
 * OIDC/OAuth2 server needs to be online to validate token.
 */
function checkAccessToken(req: Request, res: Response, next: NextFunction) {
  // Check if exists
  if (req.headers.authorization) {
    axios
      .get(prefs.auth_authenticate_url, {
        headers: {
          Authorization: req.headers.authorization,
        },
      })
      .then(function (response) {
        if (response.status !== StatusCodes.OK) {
          // Ask for login page for front to refresh token or redirect because token is expired
          res.status(StatusCodes.UNAUTHORIZED).send(prefs.auth_authorize_url);
        } else {
          // Token OK
          return next();
        }
      })
      .catch(function (error) {
        if (error.response.status === StatusCodes.UNAUTHORIZED) {
          // Ask for login page for front to refresh token or redirect because token is expired
          res.status(StatusCodes.UNAUTHORIZED).send(prefs.auth_authorize_url);
        } else {
          // Can't check if access token is valid or not
          logger.error(error);
          res.send(
            "Authentication server offline, unable to connect to XTVision"
          );
        }
      });
  } else {
    // Token empty = not logged
    if (process.env.NODE_ENV !== NODE_ENV_PROD) {
      // Ask for login page for front to redirect
      res.status(StatusCodes.UNAUTHORIZED).send(prefs.auth_authorize_url);
    } else {
      if (req.url === "/dashboards") {
        // Coming from "*" route (front App.tsx), so send 401 to front to redirect to login page
        res.status(StatusCodes.UNAUTHORIZED).send(prefs.auth_authorize_url);
      } else {
        // Redirect to login page from back
        res.redirect(prefs.auth_authorize_url);
      }
    }
  }
}

/**
 * Check if login details from basic auth are valid or not. If valid, next middleware. If not, access unauthorized.
 */
function checkDatabaseAuth(
  res: Response,
  next: NextFunction,
  basicAuth: string | undefined
) {
  try {
    // Check if exists
    if (basicAuth) {
      const basicAuthDetails = Buffer.from(basicAuth.replace(BASIC, ""), BASE64)
        .toString(ASCII)
        .split(":");
      // Dynamic configuration depending on env
      const usernameDb = (config as any)[process.env.NODE_ENV!].databaseConfig
        .username;
      const passwordDb = (config as any)[process.env.NODE_ENV!].databaseConfig
        .password;
      if (
        basicAuthDetails[0] === usernameDb &&
        basicAuthDetails[1] === passwordDb
      ) {
        // Basic auth OK
        return next();
      } else {
        // Login details from Basic auth KO
        res.sendStatus(StatusCodes.UNAUTHORIZED);
      }
    } else {
      // Login details from Basic auth KO because empty
      res.sendStatus(StatusCodes.UNAUTHORIZED);
    }
  } catch (err) {
    logger.error(err);
    res.sendStatus(StatusCodes.UNAUTHORIZED);
  }
}
