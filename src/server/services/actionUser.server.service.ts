import { Server } from "http";
import config from "../resources/config";
import {
  ActionUserDatabaseInterface,
  NewActionUser,
} from "../../database/interfaces/actionUser.database";
import { prefs, customAxios as axios } from "../../webServer";
import { ActionUserFilter } from "../interfaces/actionUserFilter";
import { logger } from "../../../logger";

/**
 * Get actionUsers in db XTVision
 */
export class ActionUserServerService {
  constructor(protected server: Server) {}

  /**
   * Insert actionUsers in db XTVision
   */
  async insertActionUser(
    newActionUser: NewActionUser
  ): Promise<ActionUserDatabaseInterface> {
    logger.info("insertActionUser");
    const actionUser = (
      await axios.post(
        config.xtvision.databaseUrl + "/actionUsers",
        newActionUser,
        {
          headers: {
            Authorization: prefs.databaseAuth,
          },
        }
      )
    ).data;
    return actionUser;
  }

  /**
   * filter a actionUser
   */
  async getActionUsersByFilter(filters: ActionUserFilter) {
    logger.info("getActionUsersByFilter");
    return [];
  }
}
