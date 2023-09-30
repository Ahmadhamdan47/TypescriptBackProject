import config from "../resources/config";
import { prefs, customAxios as axios } from "../../webServer";
import { Server } from "http";
import { CallbackAuthUser } from "../interfaces/callbackAuth.server";
import jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN,
  AUTHORIZATION_CODE,
  BEARER,
  CLIENT_ID,
  CLIENT_SECRET,
  CODE,
  GRANT_TYPE,
  REDIRECT_URI,
  REFRESH_TOKEN,
  TOKEN,
  TOKEN_TYPE_HINT,
} from "../resources/constants";
import { logger } from "../../../logger";
import { getUsernameFromToken } from "../interfaces/user.server";

export class HomeServerService {
  constructor(protected server: Server) {}

  /**
   * Get roles, configs and datas for the user connected to show pages allowed
   */
  async homePageConfig(code: any): Promise<CallbackAuthUser> {
    logger.info("homePageConfig");
    const params = new URLSearchParams();
    params.append(CLIENT_ID, prefs.auth_client_id);
    params.append(CODE, code);
    params.append(REDIRECT_URI, prefs.auth_redirect_uri);
    params.append(GRANT_TYPE, AUTHORIZATION_CODE);
    params.append(CLIENT_SECRET, prefs.auth_client_secret);
    // Get tokens infos from OAuth2/OIDC server
    const tempCallbackAuthUser: CallbackAuthUser = (
      await axios.post(prefs.auth_token_url, params)
    ).data as CallbackAuthUser;
    // Get the username from token decoded
    tempCallbackAuthUser.username = getUsernameFromToken(
      tempCallbackAuthUser.id_token,
      tempCallbackAuthUser.access_token
    );
    tempCallbackAuthUser.features = [];
    const user = (
      await axios.get(
        config.xtvision.databaseUrl +
          "/users?name=" +
          tempCallbackAuthUser.username,
        {
          headers: {
            Authorization: prefs.databaseAuth,
          },
        }
      )
    ).data[0];
    tempCallbackAuthUser.language = user.language;
    tempCallbackAuthUser.time_zone = user.time_zone;

    tempCallbackAuthUser.features = user.Roles.map((role: any) => role.Features)
      .flat()
      .map((feature: any) => feature.name);

    return tempCallbackAuthUser;
  }

  async homePageRefreshToken(refreshToken: any): Promise<CallbackAuthUser> {
    logger.info("homePageRefreshToken");
    const params = new URLSearchParams();
    params.append(CLIENT_ID, prefs.auth_client_id);
    params.append(CLIENT_SECRET, prefs.auth_client_secret);
    params.append(REFRESH_TOKEN, refreshToken);
    params.append(GRANT_TYPE, REFRESH_TOKEN);
    // Get new tokens from OAuth2/OIDC server
    return (await axios.post(prefs.auth_token_url, params)).data;
  }

  async homePageLogout(headers: any): Promise<string> {
    logger.info("homePageLogout");
    if (headers.id_token) {
      return prefs.auth_logout_url + headers.id_token;
    } else {
      const params = new URLSearchParams();
      params.append(CLIENT_ID, prefs.auth_client_id);
      params.append(CLIENT_SECRET, prefs.auth_client_secret);
      params.append(TOKEN, headers.authorization.replace(BEARER, ""));
      params.append(TOKEN_TYPE_HINT, ACCESS_TOKEN);
      await axios.post(prefs.auth_logout_url, params);
      return prefs.auth_authorize_url;
    }
  }
}
