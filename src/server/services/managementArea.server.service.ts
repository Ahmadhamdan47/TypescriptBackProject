import { Server } from "http";
import config from "../resources/config";
import {
  ManagementAreaDatabaseInterface,
  NewManagementArea,
} from "../../database/interfaces/managementArea.database";
import { prefs, customAxios as axios } from "../../webServer";
import { ManagementAreaFilter } from "../interfaces/managementAreasFilter";
import { NewManagementAreaUser } from "../../database/interfaces/managementAreaUser.database";
import { logger } from "../../../logger";

export class ManagementAreaServerService {
  constructor(protected server: Server) {}

  /**
   * Get all managements units
   */
  async getManagementAreas(): Promise<ManagementAreaDatabaseInterface[]> {
    logger.info("getManagementAreas");
    return (
      await axios.get(config.xtvision.databaseUrl + "/managementAreas", {
        headers: {
          Authorization: prefs.databaseAuth,
        },
      })
    ).data;
  }

  /**
   * Insert managementAreas in db XTVision
   */
  async insertManagementArea(
    newManagementArea: NewManagementArea
  ): Promise<ManagementAreaDatabaseInterface> {
    logger.info("insertManagementArea");
    const managementArea = (
      await axios.post(
        config.xtvision.databaseUrl + "/managementAreas",
        newManagementArea,
        {
          headers: {
            Authorization: prefs.databaseAuth,
          },
        }
      )
    ).data;
    return managementArea;
  }

  /**
   * Update managementAreas in db XTVision
   */
  async updateManagementArea(newManagementArea: NewManagementArea) {
    logger.info("updateManagementArea");
    return (
      await axios.put(
        config.xtvision.databaseUrl + "/managementAreas",
        newManagementArea,
        {
          headers: {
            Authorization: prefs.databaseAuth,
          },
        }
      )
    ).data;
  }

  /**
   * Delete a managementArea in db XTVision
   */
  async deleteManagementArea(id: string) {
    logger.info("deleteManagementArea");
    return await axios.delete(
      config.xtvision.databaseUrl + "/managementAreas/" + id,
      {
        headers: {
          Authorization: prefs.databaseAuth,
        },
      }
    );
  }

  /**
   * Get managements units in db XtVision by username
   */
  async getManagementAreasByFilter(
    filters: ManagementAreaFilter
  ): Promise<ManagementAreaDatabaseInterface[]> {
    logger.info("getManagementAreasByFilter");
    return [];
  }

  /*----------------------------------------------
  |  LINKS
  ------------------------------------------------*/

  /**
   * Link a managementArea to n users in db XtVision
   */
  async addUsers(ids: NewManagementAreaUser[]) {
    logger.info("addUsers");
    return (
      await axios.post(
        config.xtvision.databaseUrl + "/managementAreas/linkUsers",
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
