import { NextFunction, Request, Response } from "express";
import { logger } from "../../../logger";
import config from "../resources/config";
import { prefs, customAxios as axios } from "../../webServer";
import { getUsernameFromToken } from "../interfaces/user.server";

// A list of all permissions. They are automatically added to the features database table
// and are required at each corresponding api call
// TODO: make the permissions more specific
export const permissionsConstants: { [K: string]: { [K: string]: string } } = {
  USERS: {
    CREATE: "create_user",
    READ: "read_user",
    UPDATE: "update_user",
    DELETE: "delete_user",
  },
  FEATURES: {
    READ: "read_feature",
  },
  ROLES: {
    CREATE: "create_role",
    READ: "read_role",
    UPDATE: "update_role",
    DELETE: "delete_role",
  },
  DASHBOARDS: {
    CREATE: "create_dashboard",
    READ: "read_dashboard",
    UPDATE: "update_dashboard",
    DELETE: "delete_dashboard",
  },
  SYSTEMS: {
    CREATE: "create_system",
    READ: "read_system",
    UPDATE: "update_system",
    DELETE: "delete_system",
  },
  MANAGEMENT_AREAS: {
    CREATE: "create_management_area",
    READ: "read_management_area",
    UPDATE: "update_management_area",
    DELETE: "delete_management_area",
  },
  DOMAINS: {
    READ: "read_domain",
  },
  CATEGORIES: {
    // CREATE: "create_category",
    READ: "read_category",
    // UPDATE: "update_category",
    // DELETE: "delete_category",
  },
  BEHAVIORS: {
    CREATE: "create_behavior",
    READ: "read_behavior",
    UPDATE: "update_behavior",
    DELETE: "delete_behavior",
  },
  ACTION_USER: {
    READ: "read_action_user",
  },
  EVENTS: {
    READ: "read_event",
  },
  EQUIPMENTS: {
    READ: "read_equipment",
    UPDATE: "update_equipment",
  },
  EQUIPMENT_TYPES: {
    // CREATE: "create_equipment_type",
    READ: "read_equipment_type",
    // UPDATE: "update_equipment_type",
    // DELETE: "delete_equipment_type",
  },
  EQUIPMENT_BRANDS: {
    // CREATE: "create_equipment_brand",
    READ: "read_equipment_brand",
    // UPDATE: "update_equipment_brand",
    // DELETE: "delete_equipment_brand",
  },
  NOTIF_BINDING_KEYS: {
    CREATE: "create_notif_binding_key",
    READ: "read_notif_binding_key",
    UPDATE: "update_notif_binding_key",
    DELETE: "delete_notif_binding_key",
  },
  NOTIF_MESSAGES: {
    CREATE: "create_notif_message",
    READ: "read_notif_message",
    UPDATE: "update_notif_message",
    DELETE: "delete_notif_message",
  },
  LICENCES: {
    CREATE: "create_licence",
    READ: "read_licence",
    UPDATE: "update_licence",
    DELETE: "delete_licence",
  },
  DATABASE: {
    BACKUP: "backup_database",
    RESTORE: "restore_database",
    UPDLOAD: "upload_database",
    READ: "read_database",
    DELETE: "delete_database",
  },
  APPLICATION_PARAMETERS: {
    CREATE: "create_application_parameter",
    READ: "read_application_parameter",
    UPDATE: "update_application_parameter",
    DELETE: "delete_application_parameter",
  },
  AUTHENTICATION_PARAMETERS: {
    // CREATE: "create_authentication_parameter",
    READ: "read_authentication_parameter",
    UPDATE: "update_authentication_parameter",
    // DELETE: "delete_authentication_parameter",
  },
  SCHEDULED_JOBS: {
    CREATE: "create_scheduled_job",
    READ: "read_scheduled_job",
    UPDATE: "update_scheduled_job",
    DELETE: "delete_scheduled_job",
  },
  LOGS: {
    READ: "read_log",
    DELETE: "delete_log",
  },
};

/**
 * A middleware to check if the user can access the resource
 */
export function requirePermissions(permission: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get the username from token decoded
      const username = getUsernameFromToken(
        req.headers.id_token,
        req.headers.authorization
      );
      const user = (
        await axios.get(
          config.xtvision.databaseUrl + "/users?name=" + username,
          {
            headers: {
              Authorization: prefs.databaseAuth,
            },
          }
        )
      ).data[0];

      const userFeatures = user.Roles.map((role: any) => role.Features)
        .flat()
        .map((feature: any) => feature.name);

      if (userFeatures.includes(permission)) {
        next();
      } else {
        logger.warn("User does not have access to this ressource");
        res.status(403).send("User does not have access to this ressource");
      }
    } catch (err) {
      logger.error(
        "Error with permissions while accessing a ressource : ",
        err
      );
    }
  };
}
