import { prefs } from "../../webServer";
import { BEARER } from "../resources/constants";
import jwt from "jsonwebtoken";

// User object from active directory
export interface UserActiveDirectoryServerInterface {
  dn: string;
  userPrincipalName: string;
  sAMAccountName: string; // Name to save in XtVision DB
  sn: string;
  givenName: string;
  cn: string;
  displayName: string;
}

// User object from xtvision
export interface UserServerInterface {
  name?: string; // Can't update username
  password?: string; // Optionnal, only if OAuth2 server has API to manage users
  description: string;
  language: string;
  time_zone: string;
}

export function getUsernameFromToken(
  id_token?: any,
  access_token?: string
): string {
  // Decode token for user infos
  let tokenDecoded: any;
  if (id_token) {
    tokenDecoded = jwt.decode(id_token);
  } else if (access_token) {
    tokenDecoded = jwt.decode(access_token.replace(BEARER, ""));
  } else {
    return "";
  }
  // Get the username from token decoded from custom key and split if necessary
  return prefs.auth_token_username_split
    ? tokenDecoded[prefs.auth_token_username_key].split(
        prefs.auth_token_username_split
      )[0]
    : tokenDecoded[prefs.auth_token_username_key];
}
