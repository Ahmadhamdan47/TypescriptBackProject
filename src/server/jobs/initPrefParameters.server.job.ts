import config from "../resources/config";
import { prefs, customAxios as axios } from "../../webServer";
import { AuthenticationParametersServerInterface } from "../interfaces/authenticationParameters.server";
import { aesDecryptStringFromHex } from "../resources/aesUtilities.server";
import { logger } from "../../../logger";

/**
 * Init prefs with application and authentication parameters
 */
export async function initPrefParameters() {
  logger.info("initPrefParameters");
  const appliParams = (
    await axios.get(config.xtvision.databaseUrl + "/applicationParameters", {
      headers: {
        Authorization: prefs.databaseAuth,
      },
    })
  ).data;
  prefs.counter = appliParams.counter;
  prefs.value = appliParams.value;
  const authParams = (
    await axios.get(config.xtvision.databaseUrl + "/authenticationParameters", {
      headers: {
        Authorization: prefs.databaseAuth,
      },
    })
  ).data as AuthenticationParametersServerInterface;
  prefs.auth_mode = authParams.mode;
  if (authParams.authorize_url) {
    // Get auth params from database if exists
    prefs.auth_authorize_url = authParams.authorize_url;
    prefs.auth_token_url = authParams.token_url;
    prefs.auth_authenticate_url = authParams.authenticate_url;
    prefs.auth_logout_url = authParams.logout_url;
    prefs.auth_users_url = authParams.users_url;
    prefs.auth_client_id = authParams.client_id;
    prefs.auth_client_secret = await aesDecryptStringFromHex(
      authParams.client_secret
    );
    prefs.auth_redirect_uri = authParams.redirect_uri;
    prefs.auth_token_username_key = authParams.token_username_key;
    prefs.auth_token_username_split = authParams.token_username_split;
  } else {
    // Else get from config.ts
    prefs.auth_authorize_url = config.auth.authorize;
    prefs.auth_token_url = config.auth.token;
    prefs.auth_authenticate_url = config.auth.authenticate;
    prefs.auth_logout_url = config.auth.logout;
    prefs.auth_users_url = config.auth.users;
    prefs.auth_client_id = config.auth.client_id;
    prefs.auth_client_secret = config.auth.client_secret;
    prefs.auth_redirect_uri = config.auth.redirect_uri;
    prefs.auth_token_username_key = config.auth.token_username_key;
    prefs.auth_token_username_split = config.auth.token_username_split;
  }
}
