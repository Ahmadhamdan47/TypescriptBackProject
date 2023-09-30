import { Server } from "http";
import { AuthenticationParametersServerInterface } from "../interfaces/authenticationParameters.server";
import config from "../resources/config";
import { prefs, customAxios as axios } from "../../webServer";
import { aesEncryptStringToHex } from "../resources/aesUtilities.server";
import { logger } from "../../../logger";

export class AuthenticationParametersServerService {
  constructor(protected server: Server) {}

  async getAuthenticationParameters(): Promise<AuthenticationParametersServerInterface> {
    logger.info("getAuthenticationParameters");
    return (
      await axios.get(
        config.xtvision.databaseUrl + "/authenticationParameters",
        {
          headers: {
            Authorization: prefs.databaseAuth,
          },
        }
      )
    ).data;
  }

  async updateAuthenticationParameters(
    attributesToUpdate: AuthenticationParametersServerInterface
  ) {
    logger.info("updateAuthenticationParameters");
    if (attributesToUpdate.mode) {
      prefs.auth_mode = attributesToUpdate.mode;
    }
    if (attributesToUpdate.client_secret) {
      prefs.auth_client_secret = attributesToUpdate.client_secret;
      attributesToUpdate.client_secret = await aesEncryptStringToHex(
        attributesToUpdate.client_secret
      );
    }
    if (attributesToUpdate.admin_client_secret)
      attributesToUpdate.admin_client_secret = await aesEncryptStringToHex(
        attributesToUpdate.admin_client_secret
      );
    if (attributesToUpdate.ad_password)
      attributesToUpdate.ad_password = await aesEncryptStringToHex(
        attributesToUpdate.ad_password
      );
    if (attributesToUpdate.authorize_url)
      prefs.auth_authorize_url = attributesToUpdate.authorize_url;
    if (attributesToUpdate.token_url)
      prefs.auth_token_url = attributesToUpdate.token_url;
    if (attributesToUpdate.authenticate_url)
      prefs.auth_authenticate_url = attributesToUpdate.authenticate_url;
    if (attributesToUpdate.logout_url)
      prefs.auth_logout_url = attributesToUpdate.logout_url;
    if (attributesToUpdate.users_url)
      prefs.auth_users_url = attributesToUpdate.users_url;
    if (attributesToUpdate.client_id)
      prefs.auth_client_id = attributesToUpdate.client_id;
    if (attributesToUpdate.redirect_uri)
      prefs.auth_redirect_uri = attributesToUpdate.redirect_uri;
    if (attributesToUpdate.token_username_key)
      prefs.auth_token_username_key = attributesToUpdate.token_username_key;
    if (attributesToUpdate.token_username_split)
      prefs.auth_token_username_split = attributesToUpdate.token_username_split;
    await axios.put(
      config.xtvision.databaseUrl + "/authenticationParameters",
      attributesToUpdate,
      {
        headers: {
          Authorization: prefs.databaseAuth,
        },
      }
    );
  }
}
