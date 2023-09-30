import { Request, Response, NextFunction } from "express";
import axios from "axios";
import { hashData } from "../resources/encryptUtilities";
import config from "../../server/resources/config";
import { prefs } from "../../webServer";
import userActionConfig from "../interfaces/userActionConfig.json";
import { NewGeneralUserAction } from "../../database/interfaces/generalUserAction.database";
import { logger } from "../../../logger";
import { MASKED_VALUE } from "../resources/constants";
import { HTTP_METHODS } from "../resources/constants";
import { getUsernameFromToken } from "../interfaces/user.server"; // Import the method to retrieve the username from a token

function maskData(data: any, maskedAttributes: string[]): any {
  const maskedData = { ...data };
  maskedAttributes.forEach(attr => {
    if (maskedData[attr]) {
      maskedData[attr] = MASKED_VALUE;
    }
  });
  return maskedData;
}

export async function userActionMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const actionToLog = userActionConfig.userActionsToLog.find(action =>
    `${req.method.toUpperCase()}:${req.path}`.includes(action.name)
  );

  if (actionToLog) {
    const generalUserAction: NewGeneralUserAction = {
      actionType: actionToLog?.actionType || "",
      actionObject: actionToLog?.actionObject || "",
      username: undefined!,
      isSuccessful: undefined!,
      description: undefined!,
      param1: null,
      param2: null,
    };

    // Get the username from the token using the method
    const username = await getUsernameFromToken(req.headers.id_token,
      req.headers.authorization);
    generalUserAction.username = username;

    const isSecurityAction = actionToLog.securityAction === true;

    if (req.method === HTTP_METHODS.POST) {
      generalUserAction.param1 = JSON.stringify(req.body);
    } else if (req.method === HTTP_METHODS.PUT) {
      const oldData = (
        await axios.get(config.xtvision.databaseUrl + req.url, {
          headers: {
            Authorization: prefs.databaseAuth,
          },
        })
      ).data;

      // to compare the oldData with the new Data we need to remove the ID from the oldData
      const oldDataWithoutId = { ...oldData };
      delete oldDataWithoutId.id;
      delete oldDataWithoutId.createdAt;
      delete oldDataWithoutId.updatedAt;

      // Check if any excludedAttributes or maskedAttributes exist for this action
      const excludedAttributes = actionToLog.excludedAttributes ?? [];
      const maskedAttributes = actionToLog.maskedAttributes ?? [];

      // Find the changed attributes between oldDataWithoutId and req.body
      const changedAttributes: string[] = Object.keys(req.body).filter(
        key => hashData(oldDataWithoutId[key]) !== hashData(req.body[key])
      );

      // Check if any changed attribute is in excludedAttributes, if so, skip logging
      const isExcludedAttributeChanged = changedAttributes.some(attr =>
        excludedAttributes.includes(attr)
      );
      //if the only changed attribute is the excluded call the next middleware
      if (isExcludedAttributeChanged) {
        next();
        return;
      }

      // Mask the changed attributes in param1 and param2 if they are in maskedAttributes
      generalUserAction.param1 = JSON.stringify(
        maskData(req.body, maskedAttributes)
      );
      generalUserAction.param2 = JSON.stringify(
        maskData(oldDataWithoutId, maskedAttributes)
      );
    } else if (req.method === HTTP_METHODS.DELETE) {
      const oldData = (
        await axios.get(config.xtvision.databaseUrl + req.url, {
          headers: {
            Authorization: prefs.databaseAuth,
          },
        })
      ).data;
      generalUserAction.param1 = JSON.stringify(oldData);
    }

    // Call the next middleware in the stack and wait for the response
    try {
      await new Promise(resolve => {
        res.on("finish", resolve);
        next();
      });

      generalUserAction.isSuccessful =
        res.statusCode >= 200 && res.statusCode < 400;
      if (res.statusCode >= 400) {
        generalUserAction.description = `${generalUserAction.username} ${actionToLog?.description} but got an error: ${res.statusCode} ${res.statusMessage}`;
      } else {
        generalUserAction.description = `${generalUserAction.username} ${actionToLog?.description}`;
      }
    } catch (err) {
      generalUserAction.isSuccessful = false;
      generalUserAction.description = `${generalUserAction.username} requested ${actionToLog?.actionName} but got an error: ${err}`;
    }

    // Send the generalUserAction to be logged
    try {
      if (isSecurityAction) {
        await axios.post(
          config.xtvision.databaseUrl + "/securityUserActions",
          generalUserAction,
          {
            headers: {
              Authorization: prefs.databaseAuth,
            },
          }
        );
      } else {
        await axios.post(
          config.xtvision.databaseUrl + "/generalUserActions",
          generalUserAction,
          {
            headers: {
              Authorization: prefs.databaseAuth,
            },
          }
        );
      }
    } catch (err) {
      // Handle error if logging fails
      logger.error("Failed to log user action:", err);
    }
  } else {
    // No action to log, proceed to next middleware
    next();
  }
}
