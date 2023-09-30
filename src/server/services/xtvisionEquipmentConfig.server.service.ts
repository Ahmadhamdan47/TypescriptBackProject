import config from "../resources/config";
import { Server } from "http";
import { prefs, customAxios as axios } from "../../webServer";
import { logger } from "../../../logger";
import { XtvisionEquipmentConfigDatabaseInterface } from "../../database/interfaces/xtvisionEquipmentConfig.database";

export class XtvisionEquipmentConfigServerService {
  constructor(protected server: Server) {}

  /**
   * Get all xtvision equipments configs
   */
  async getXtvisionEquipmentConfigs() {
    logger.info("getXtvisionEquipmentConfigs");
    return (
      await axios.get(
        config.xtvision.databaseUrl + "/xtvisionEquipmentConfigs",
        {
          headers: {
            Authorization: prefs.databaseAuth,
          },
        }
      )
    ).data as XtvisionEquipmentConfigDatabaseInterface[];
  }

  /**
   * Update one xtvision equipment config
   */
  async updateXtvisionEquipmentConfig(
    id: string,
    xtvisionEquipmentConfig: any
  ) {
    logger.info("updateXtvisionEquipmentConfig");
    await axios.put(
      config.xtvision.databaseUrl + "/xtvisionEquipmentConfigs/" + id,
      xtvisionEquipmentConfig,
      {
        headers: {
          Authorization: prefs.databaseAuth,
        },
      }
    );
  }
}
