import { Server } from "http";
import { ApplicationParametersServerInterface } from "../interfaces/applicationParameters.server";
import config from "../resources/config";
import { prefs, customAxios as axios } from "../../webServer";
import { logger } from "../../../logger";

export class ApplicationParametersServerService {
  constructor(protected server: Server) {}

  async getApplicationParameters(): Promise<ApplicationParametersServerInterface> {
    logger.info("getApplicationParameters");
    return (
      await axios.get(config.xtvision.databaseUrl + "/applicationParameters", {
        headers: {
          Authorization: prefs.databaseAuth,
        },
      })
    ).data;
  }

  async updateApplicationParameters(
    attributesToUpdate: ApplicationParametersServerInterface
  ) {
    logger.info("updateApplicationParameters");
    await axios.put(
      config.xtvision.databaseUrl + "/applicationParameters",
      attributesToUpdate,
      {
        headers: {
          Authorization: prefs.databaseAuth,
        },
      }
    );
  }
}
