import { Server } from "http";
import { EquipmentBrandDatabaseInterface } from "../../database/interfaces/equipmentBrand.database";
import config from "../resources/config";
import { prefs, customAxios as axios } from "../../webServer";
import { logger } from "../../../logger";

export class EquipmentBrandServerService {
  constructor(protected server: Server) {}

  async getEquipmentsBrands(): Promise<EquipmentBrandDatabaseInterface[]> {
    logger.info("getEquipmentsBrands");
    return (
      await axios.get(config.xtvision.databaseUrl + "/equipmentsBrands", {
        headers: {
          Authorization: prefs.databaseAuth,
        },
      })
    ).data;
  }
}
