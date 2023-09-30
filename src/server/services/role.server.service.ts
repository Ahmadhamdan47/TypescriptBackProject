import { Server } from "http";
import config from "../resources/config";
import { prefs, customAxios as axios } from "../../webServer";
import { RoleFilter } from "../interfaces/rolesFilter";
import {
  NewRole,
  RoleDatabaseInterface,
} from "../../database/interfaces/role.database";
import { NewRoleUser } from "../../database/interfaces/roleUser.database";
import { NewRoleFeature } from "../../database/interfaces/roleFeature.database";
import { logger } from "../../../logger";

export class RoleServerService {
  constructor(protected server: Server) {}

  async insertRole(newRole: NewRole): Promise<RoleDatabaseInterface> {
    logger.info("insertRole");
    return (
      await axios.post(config.xtvision.databaseUrl + "/roles", newRole, {
        headers: {
          Authorization: prefs.databaseAuth,
        },
      })
    ).data;
  }

  /**
   * get all roles from db XtVision
   */
  async getRoles(): Promise<RoleDatabaseInterface[]> {
    logger.info("getRoles");
    return (
      await axios.get(config.xtvision.databaseUrl + "/roles", {
        headers: {
          Authorization: prefs.databaseAuth,
        },
      })
    ).data;
  }

  /**
   * Get roles in db XTVision by username or features
   */
  async getRolesByFilter(
    filters: RoleFilter
  ): Promise<RoleDatabaseInterface[]> {
    logger.info("getRolesByFilter");
    return [];
  }

  /**
   * Insert or update new role in db XtVision
   */
  async updateRole(roleId: string, newRole: NewRole) {
    logger.info("updateRole");
    await axios.put(config.xtvision.databaseUrl + "/roles/" + roleId, newRole, {
      headers: {
        Authorization: prefs.databaseAuth,
      },
    });
  }

  /**
   * Delete a role in db XtVision
   */
  async deleteRole(name: string) {
    logger.info("deleteRole");
    await axios.delete(config.xtvision.databaseUrl + "/roles/" + name, {
      headers: {
        Authorization: prefs.databaseAuth,
      },
    });
  }

  /**
   * Delete a role by id in db XtVision
   */
  async deleteRoleById(roleId: string) {
    logger.info("deleteRoleById");
    await axios.delete(config.xtvision.databaseUrl + "/roles/" + roleId, {
      headers: {
        Authorization: prefs.databaseAuth,
      },
    });
  }

  /*----------------------------------------------
  |  LINKS
  ------------------------------------------------*/

  /**
   * Link a role to n users in db XtVision
   */
  async addUsers(ids: NewRoleUser[]) {
    logger.info("addUsers");
    return (
      await axios.post(config.xtvision.databaseUrl + "roles/linkUsers", ids, {
        headers: {
          Authorization: prefs.databaseAuth,
        },
      })
    ).data;
  }

  /**
   * Link a role to n features in db XtVision
   */
  async addFeatures(ids: NewRoleFeature[]) {
    logger.info("addFeatures");
    return (
      await axios.post(
        config.xtvision.databaseUrl + "roles/linkFeatures",
        ids,
        {
          headers: {
            Authorization: prefs.databaseAuth,
          },
        }
      )
    ).data;
  }
}
