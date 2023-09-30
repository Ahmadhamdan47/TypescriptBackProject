import { Server } from "http";
import { DomainDatabaseInterface } from "../../database/interfaces/domain.database";
import config from "../resources/config";
import { prefs, customAxios as axios } from "../../webServer";
import { logger } from "../../../logger";

export class DomainServerService {
  constructor(protected server: Server) {}

  /**
   * get all domains from db XtVision
   */
  async getDomains(): Promise<DomainDatabaseInterface[]> {
    logger.info("getDomains");
    return (
      await axios.get(config.xtvision.databaseUrl + "/domains", {
        headers: {
          Authorization: prefs.databaseAuth,
        },
      })
    ).data;
  }

  /**
   * get domain from db XtVision
   */
  async getDomain(id: any): Promise<DomainDatabaseInterface> {
    logger.info("getDomain");
    return (
      await axios.get(config.xtvision.databaseUrl + "/domains/" + id, {
        headers: {
          Authorization: prefs.databaseAuth,
        },
      })
    ).data;
  }
}
