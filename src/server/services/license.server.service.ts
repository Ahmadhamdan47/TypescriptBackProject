import { Server } from "http";
import { LicenseDatabaseInterface } from "../../database/interfaces/license.database";
import { logger } from "../../../logger";

export class LicenseServerService {
  constructor(protected server: Server) {}

  /**
   * Configure infos license number
   */
  async insertOrUpdateInfosLicense(license: LicenseDatabaseInterface) {
    logger.info("insertOrUpdateInfosLicense");
  }

  /**
   * Get element from table license from db xtvision (param = name column needed)
   */
  async getElementFromLicense(param: string): Promise<string> {
    logger.info("getElementFromLicense");
    return "";
  }
}
