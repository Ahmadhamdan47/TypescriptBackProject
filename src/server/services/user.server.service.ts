import { Server } from "http";
import config from "../resources/config";
import { UserDatabaseInterface } from "../../database/interfaces/user.database";
import { prefs, customAxios as axios } from "../../webServer";
import {
  UserActiveDirectoryServerInterface,
  UserServerInterface,
} from "../interfaces/user.server";
import ActiveDirectory from "activedirectory2";
import { aesDecryptStringFromHex } from "../resources/aesUtilities.server";
import { logger } from "../../../logger";
import { AuthenticationParametersServerInterface } from "../interfaces/authenticationParameters.server";
import { NewManagementAreaUser } from "../../database/interfaces/managementAreaUser.database";
import { NewRoleUser } from "../../database/interfaces/roleUser.database";
import { NewCategoryUser } from "../../database/interfaces/categoryUser.database";
import { NewDashboardUser } from "../../database/interfaces/dashboardUser.database";
import {
  BEARER,
  CLIENT_CREDENTIALS,
  CLIENT_ID,
  CLIENT_SECRET,
  GRANT_TYPE,
  PASSWORD,
} from "../resources/constants";
import { UserFilter } from "../interfaces/usersFilter";

// TODO links for V2

export class UserServerService {
  constructor(protected server: Server) {}

  /**
   * Get users in db XTVision
   */
  async getUsers(): Promise<UserDatabaseInterface[]> {
    logger.info("getUsers");
    return (
      await axios.get(config.xtvision.databaseUrl + "/users", {
        headers: {
          Authorization: prefs.databaseAuth,
        },
      })
    ).data;
  }

  /**
   * Get user by its id in db XTVision
   */
  async getUser(id: string): Promise<UserDatabaseInterface> {
    logger.info("getUser");
    return (
      await axios.get(config.xtvision.databaseUrl + "/users/" + id, {
        headers: {
          Authorization: prefs.databaseAuth,
        },
      })
    ).data;
  }

  /**
   * Get active directory users
   */
  async getActiveDirectoryUsers(): Promise<
    UserActiveDirectoryServerInterface[]
  > {
    logger.info("getActiveDirectoryUsers");
    const authenticationParameters = (
      await axios.get(
        config.xtvision.databaseUrl + "/authenticationParameters",
        {
          headers: {
            Authorization: prefs.databaseAuth,
          },
        }
      )
    ).data as AuthenticationParametersServerInterface;
    const username = authenticationParameters.ad_username;
    const password = await aesDecryptStringFromHex(
      authenticationParameters.ad_password
    );
    const ad = new ActiveDirectory({
      url: authenticationParameters.ad_url,
      baseDN: authenticationParameters.ad_base_dn,
      username: username,
      password: password,
    });
    return new Promise(resolve => {
      ad.findUsers(function (err, users) {
        if (err) {
          logger.error(err);
          throw err;
        } else {
          resolve(users as UserActiveDirectoryServerInterface[]);
        }
      });
    });
  }

  /**
   * Get users in db xtvision by filters
   */
  async getUsersByFilter(
    filters: UserFilter
  ): Promise<UserDatabaseInterface[]> {
    logger.info("getUsersByFilter");
    return (
      await axios.post(config.xtvision.databaseUrl + "/users/filter", filters, {
        headers: {
          Authorization: prefs.databaseAuth,
        },
      })
    ).data;
  }

  /**
   * Insert user in db XTVision
   */
  async insertUser(
    newUser: UserServerInterface
  ): Promise<UserDatabaseInterface> {
    logger.info("insertUser");
    // If we have an OAuth2/OIDC server where we can manage users
    if (prefs.auth_users_url) {
      const access_token = await getAccessTokenFromAuthServerForAdmin();
      // Create user with password in OAuth2/OIDC server
      await axios.post(
        prefs.auth_users_url,
        {
          username: newUser.name,
          enabled: "true",
          credentials: [
            {
              temporary: false,
              type: PASSWORD,
              value: newUser.password,
            },
          ],
        },
        {
          headers: {
            Authorization: BEARER + access_token,
          },
        }
      );
    }
    // Create user in db xtvision
    delete newUser.password;
    return (
      await axios.post(config.xtvision.databaseUrl + "/users", newUser, {
        headers: {
          Authorization: prefs.databaseAuth,
        },
      })
    ).data;
  }

  /**
   * Update user in db XTVision
   */
  async updateUser(id: string, newUser: UserServerInterface) {
    logger.info("updateUser");
    // Can only update password in OAuth2/OIDC server if we can manage users in it
    if (prefs.auth_users_url && newUser.password) {
      const access_token = await getAccessTokenFromAuthServerForAdmin();
      // Get user id OAuth2 from user name and then update user in OAuth2/OIDC server with id
      const userAuthServerId = await getUserIdFromAuthServer(id, access_token);
      await axios.put(
        prefs.auth_users_url + "/" + userAuthServerId,
        {
          credentials: [
            {
              temporary: false,
              type: PASSWORD,
              value: newUser.password,
            },
          ],
        },
        {
          headers: {
            Authorization: BEARER + access_token,
          },
        }
      );
    }
    // Update user in db xtvision
    // Can't update user name (unique and must be identical to AD or OAuth2/OIDC server) and password (doesn't exist) in db xtvision
    delete newUser.name;
    delete newUser.password;
    await axios.put(config.xtvision.databaseUrl + "/users/" + id, newUser, {
      headers: {
        Authorization: prefs.databaseAuth,
      },
    });
  }

  /**
   * Delete a user in db XTVision
   */
  async deleteUser(id: string) {
    logger.info("deleteUser");
    // If we have an OAuth2/OIDC server where we can manage users
    if (prefs.auth_users_url) {
      const access_token = await getAccessTokenFromAuthServerForAdmin();
      // Get user id OAuth2 from user name and then delete user in OAuth2/OIDC server with id
      const userAuthServerId = await getUserIdFromAuthServer(id, access_token);
      await axios.delete(prefs.auth_users_url + "/" + userAuthServerId, {
        headers: {
          Authorization: BEARER + access_token,
        },
      });
    }
    // Delete user in db xtvision
    await axios.delete(config.xtvision.databaseUrl + "/users/" + id, {
      headers: {
        Authorization: prefs.databaseAuth,
      },
    });
  }

  /*----------------------------------------------
  |  LINKS
  ------------------------------------------------*/

  /**
   * Link a role to a user
   */
  async addRoles(ids: NewRoleUser[]) {
    logger.info("addRoles");
    return (
      await axios.post(config.xtvision.databaseUrl + "/users/linkRoles", ids, {
        headers: {
          Authorization: prefs.databaseAuth,
        },
      })
    ).data;
  }

  /**
   * Link a dashboard to a user
   */
  async addDashboards(ids: NewDashboardUser[]) {
    logger.info("addDashboards");
    return (
      await axios.post(
        config.xtvision.databaseUrl + "/users/linkDashboards",
        ids,
        {
          headers: {
            Authorization: prefs.databaseAuth,
          },
        }
      )
    ).data;
  }

  /**
   * Link a management area to a user
   */
  async addManagementAreas(ids: NewManagementAreaUser[]) {
    logger.info("addManagementAreas");
    return (
      await axios.post(
        config.xtvision.databaseUrl + "/users/linkManagementAreas",
        ids,
        {
          headers: {
            Authorization: prefs.databaseAuth,
          },
        }
      )
    ).data;
  }

  /**
   * Link a category to a user
   */
  async addCategories(ids: NewCategoryUser[]) {
    logger.info("addCategories");
    return (
      await axios.post(
        config.xtvision.databaseUrl + "/users/linkCategories",
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

/**
 * Get admin access token from auth server to manage auth users
 */
async function getAccessTokenFromAuthServerForAdmin(): Promise<string> {
  logger.info("getAccessTokenFromAuthServerForAdmin");
  // Get auth params to get admin infos
  const authParams = (
    await axios.get(config.xtvision.databaseUrl + "/authenticationParameters", {
      headers: {
        Authorization: prefs.databaseAuth,
      },
    })
  ).data as AuthenticationParametersServerInterface;
  // Get access token from OAuth2/OIDC server for admin
  const params = new URLSearchParams();
  if (authParams.admin_client_id) {
    params.append(CLIENT_ID, authParams.admin_client_id);
    params.append(CLIENT_SECRET, authParams.admin_client_secret);
  } else {
    params.append(CLIENT_ID, config.auth.admin_client_id);
    params.append(CLIENT_SECRET, config.auth.admin_client_secret);
  }
  params.append(GRANT_TYPE, CLIENT_CREDENTIALS);
  return (await axios.post(prefs.auth_token_url, params)).data.access_token;
}

/**
 * Get user id from auth server to manage a specific auth user
 */
async function getUserIdFromAuthServer(
  id: string,
  access_token: string
): Promise<string> {
  logger.info("getUserIdFromAuthServer");
  const userDb = (
    await axios.get(config.xtvision.databaseUrl + "/users/" + id, {
      headers: {
        Authorization: prefs.databaseAuth,
      },
    })
  ).data as UserDatabaseInterface;
  return (
    await axios.get(prefs.auth_users_url + "?username=" + userDb.name, {
      headers: {
        Authorization: BEARER + access_token,
      },
    })
  ).data[0].id;
}
