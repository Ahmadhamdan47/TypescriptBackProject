import { Server } from "http";
import { logger } from "../../../logger";
import {
  NewDashboardUser,
  DashboardUserDatabaseInterface,
} from "../interfaces/dashboardUser.database";
import { DashboardUser } from "../models/dashboardUser.model";

/**
 * This database is the link between dashboards and users: each row takes a dashboard id and a user id.
 */
export class DashboardUserDatabaseService {
  constructor(protected server: Server) {}

  /**
   * creates a list of links
   * @param newDashboardsUsers object containing a dashboard id and a user id
   * @returns DashboardUserDatabaseInterface[]
   */
  async createDashboardsUsers(
    newDashboardsUsers: NewDashboardUser[]
  ): Promise<DashboardUserDatabaseInterface[]> {
    logger.info("createDashboardsUsers");
    try {
      return await DashboardUser.bulkCreate(newDashboardsUsers);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  /**
   * retrieves all links between dashboards and users
   * @param dashboardId if set, retrieves links correspoding to that dashboard
   * @param userId if set, retrieves links correspoding to that user
   * @returns DashboardUserDatabaseInterface[]
   */
  async retrieveAllDashboardsUsers(
    dashboardId: any,
    userId: any
  ): Promise<DashboardUserDatabaseInterface[] | null> {
    logger.info("retrieveAllDashboardsUsers");
    try {
      let result = [];
      if (dashboardId) {
        result = await DashboardUser.findAll({
          where: {
            DashboardId: dashboardId,
          },
        });
      } else if (userId) {
        result = await DashboardUser.findAll({
          where: {
            UserId: userId,
          },
        });
      } else {
        result = await DashboardUser.findAll();
      }
      return result;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }
  /**
   *
   * @param dashboardsIds
   * @returns number[], list of users ids from dashboards ids
   */
  async retrieveAllUsersIdsFromDashboardsIds(
    dashboardsIds: number[]
  ): Promise<number[]> {
    logger.info("retrieveAllUsersIdsFromDashboardsIds");
    try {
      let result = [];
      result = await DashboardUser.findAll({
        attributes: ["UserId"],
        raw: true,
        where: {
          DashboardId: dashboardsIds,
        },
      });
      return result.map(raw => raw.UserId);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }
}
