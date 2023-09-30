import { NewDashboard } from "../interfaces/dashboard.database";
import { Dashboard } from "../models/dashboard.model";
import { Server } from "http";
import { logger } from "../../../logger";
import { DashboardUserDatabaseService } from "./dashboardUser.database.service";
import { NewDashboardUser } from "../interfaces/dashboardUser.database";

export class DashboardDatabaseService {
  constructor(protected server: Server) {}
  dashboardUserService = new DashboardUserDatabaseService(this.server);

  async createOneDashboard(newDashboard: NewDashboard): Promise<Dashboard> {
    logger.info("createOneDashboard");
    try {
      const result = await Dashboard.create(newDashboard);

      const dashboardsUserIds = newDashboard.userIds?.map(userId => ({
        UserId: userId,
        DashboardId: result.id,
      }));
      if (dashboardsUserIds) {
        await this.addUsers(dashboardsUserIds);
      }
      return result;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async updateDashboardById(id: string, newDashboard: any): Promise<any> {
    logger.info("updateDashboardById");
    try {
      return await Dashboard.update(newDashboard, {
        where: {
          id,
        },
      });
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveAllDashboards(): Promise<Dashboard[]> {
    logger.info("retrieveAllDashboards");
    try {
      return await Dashboard.findAll();
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveOneDashboard(id: string): Promise<Dashboard | null> {
    logger.info("retrieveOneDashboard");
    try {
      return await Dashboard.findByPk(id);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async deleteAllDashboards(): Promise<void> {
    logger.info("deleteAllDashboards");
    try {
      await Dashboard.destroy({
        where: {},
        truncate: false,
      });
      return;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async deleteOneDashboardById(id: string): Promise<void> {
    logger.info("deleteOneDashboardById");
    try {
      await Dashboard.destroy({
        where: {
          id,
        },
      });
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  /*----------------------------------------------
  |  LINKS
  ------------------------------------------------*/

  async addUsers(ids: NewDashboardUser[]): Promise<void> {
    logger.info("addUsers");
    await this.dashboardUserService.createDashboardsUsers(ids);
  }
}
