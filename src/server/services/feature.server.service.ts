import { Server } from "http";
import config from "../resources/config";
import { FeatureDatabaseInterface } from "../../database/interfaces/feature.database";
import { prefs, customAxios as axios } from "../../webServer";
import { FeatureFilter } from "../interfaces/featuresFilter";
import { NewRoleFeature } from "../../database/interfaces/roleFeature.database";
import { logger } from "../../../logger";

/**
 * Get features in db XTVision
 */
export class FeatureServerService {
  constructor(protected server: Server) {}

  /**
   * get all features from db XtVision
   */
  async getFeatures(): Promise<FeatureDatabaseInterface[]> {
    logger.info("getFeatures");
    return (
      await axios.get(config.xtvision.databaseUrl + "/features", {
        headers: {
          Authorization: prefs.databaseAuth,
        },
      })
    ).data;
  }

  /**
   * get all features in db XtVision by rolename or username
   */
  async getFeaturesByFilter(
    filters: FeatureFilter
  ): Promise<FeatureDatabaseInterface[]> {
    logger.info("getFeaturesByFilter");
    return [];
  }

  /*----------------------------------------------
  |  LINKS
  ------------------------------------------------*/

  async addRoles(ids: NewRoleFeature[]) {
    logger.info("addRoles");
    return (
      await axios.post(
        config.xtvision.databaseUrl + "/features/linkRoles",
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
