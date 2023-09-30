import { Server } from "http";
import config from "../resources/config";
import { prefs, customAxios as axios } from "../../webServer";
import {
  BehaviorDatabaseInterface,
  NewBehavior,
} from "../../database/interfaces/behavior.database";
import { BehaviorFilter } from "../interfaces/behaviorsFilter";
import { logger } from "../../../logger";

export class BehaviorServerService {
  constructor(protected server: Server) {}

  /**
   * Get all behaviors
   */
  async getBehaviors(): Promise<BehaviorDatabaseInterface[]> {
    return (
      await axios.get(config.xtvision.databaseUrl + "/behaviors", {
        headers: {
          Authorization: prefs.databaseAuth,
        },
      })
    ).data;
  }

  /**
   * Insert a behavior in db XTVision
   */
  async insertBehavior(
    newBehavior: NewBehavior
  ): Promise<BehaviorDatabaseInterface> {
    return (
      await axios.post(
        config.xtvision.databaseUrl + "/behaviors",
        newBehavior,
        {
          headers: {
            Authorization: prefs.databaseAuth,
          },
        }
      )
    ).data;
  }

  /**
   * Update a behavior in db XTVision
   */
  async updateBehavior(newBehavior: NewBehavior) {
    logger.info("updateBehavior");
    return (
      await axios.put(config.xtvision.databaseUrl + "/behaviors", newBehavior, {
        headers: {
          Authorization: prefs.databaseAuth,
        },
      })
    ).data;
  }

  /**
   * Delete a behavior in db XTVision
   */
  async deleteBehavior(id: string) {
    logger.info("deleteBehavior");
    return await axios.delete(
      config.xtvision.databaseUrl + "/behaviors/" + id,
      {
        headers: {
          Authorization: prefs.databaseAuth,
        },
      }
    );
  }

  /**
   * Get behaviors in db XtVision by username
   */
  async getBehaviorsByFilter(
    filters: BehaviorFilter
  ): Promise<BehaviorDatabaseInterface[]> {
    logger.info("getBehaviorsByFilter");
    return [];
  }
}
