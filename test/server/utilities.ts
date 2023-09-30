import { BASE64, BASIC } from "../../src/server/resources/constants";
import * as configDb from "../../src/database/config/config.json";
import { prefs } from "../../src/webServer";
import config from "../../src/server/resources/config";

export const header = {
  headers: {
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJ4dHZpc2lvbiJ9.1aTOdo9xXqN6NbpgSrQMdiuuIY7PXwfSGd6Ejx6teu4",
  },
};

export const databaseHeader = {
  headers: {
    Authorization:
      BASIC +
      Buffer.from(
        (configDb as any)[process.env.NODE_ENV!].databaseConfig.username +
          ":" +
          (configDb as any)[process.env.NODE_ENV!].databaseConfig.password
      ).toString(BASE64),
  },
};

export function initPrefsForTests() {
  prefs.auth_authenticate_url = config.auth.authenticate;
  prefs.auth_token_username_key = config.auth.token_username_key;
  prefs.auth_token_url = config.auth.token;
}
