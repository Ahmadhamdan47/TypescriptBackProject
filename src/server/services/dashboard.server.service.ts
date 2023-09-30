import { Server } from "http";
import config from "../resources/config";
import { Dashboard } from "../../database/models/dashboard.model";
import { NewDashboard } from "../../database/interfaces/dashboard.database";
import { prefs, customAxios as axios } from "../../webServer";
import { logger } from "../../../logger";
import { NewDashboardUser } from "../../database/interfaces/dashboardUser.database";

/**
 * Get dashboards in db XTVision
 */
export class DashboardServerService {
  constructor(protected server: Server) {}

  async getDashboards(): Promise<Dashboard[]> {
    logger.info("getDashboards");
    return (
      await axios.get(config.xtvision.databaseUrl + "/dashboards", {
        headers: {
          Authorization: prefs.databaseAuth,
        },
      })
    ).data;
  }

  async getDashboard(id: string): Promise<Dashboard> {
    logger.info("getDashboard");
    return (
      await axios.get(config.xtvision.databaseUrl + "/dashboards/" + id, {
        headers: {
          Authorization: prefs.databaseAuth,
        },
      })
    ).data;
  }

  /**
   * Insert dashboards in db XTVision
   */
  async insertDashboard(newDashboard: NewDashboard): Promise<Dashboard> {
    logger.info("insertDashboard");
    return (
      await axios.post(
        config.xtvision.databaseUrl + "/dashboards",
        newDashboard,
        {
          headers: {
            Authorization: prefs.databaseAuth,
          },
        }
      )
    ).data;
  }

  /**
   * update dashboards in db XTVision
   */
  async updateDashboard(id: string, newDashboard: NewDashboard) {
    logger.info("updateDashboard");
    try {
      await axios.put(
        config.xtvision.databaseUrl + "/dashboards/" + id,
        newDashboard,
        {
          headers: {
            Authorization: prefs.databaseAuth,
          },
        }
      );
    } catch (error) {
      logger.error(error);
    }
  }
  /**
   * Delete a dashboard in db XTVision
   */
  async deleteDashboard(id: string) {
    logger.info("deleteDashboard");
    try {
      await axios.delete(config.xtvision.databaseUrl + "/dashboards/" + id, {
        headers: {
          Authorization: prefs.databaseAuth,
        },
      });
    } catch (error) {
      logger.error(error);
    }
  }

  /**
   * Link a dashboard to users
   */
  async addUsers(ids: NewDashboardUser[]) {
    logger.info("addUsers");
    return (
      await axios.post(config.xtvision.databaseUrl + "/dashboardsUsers", ids, {
        headers: {
          Authorization: prefs.databaseAuth,
        },
      })
    ).data;
  }
}
