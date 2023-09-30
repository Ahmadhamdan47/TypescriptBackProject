import { Server } from "http";
import { logger } from "../../../logger";
import {
  NewManagementAreaUser,
  ManagementAreaUserDatabaseInterface,
} from "../interfaces/managementAreaUser.database";
import { ManagementAreaUser } from "../models/managementAreaUser.model";

/**
 * This database is the link between managementareas and users: each row takes a managementarea id and a user id.
 */
export class ManagementAreaUserDatabaseService {
  constructor(protected server: Server) {}

  /**
   * creates a list of links
   * @param newManagementAreasUsers object containing a managementarea id and a user id
   * @returns ManagementAreaUserDatabaseInterface[]
   */
  async createManagementAreasUsers(
    newManagementAreasUsers: NewManagementAreaUser[]
  ): Promise<ManagementAreaUserDatabaseInterface[]> {
    logger.info("createManagementAreasUsers");
    try {
      return await ManagementAreaUser.bulkCreate(newManagementAreasUsers);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  /**
   * retrieves all links between managementareas and users
   * @param managementareaId if set, retrieves links correspoding to that managementarea
   * @param userId if set, retrieves links correspoding to that user
   * @returns ManagementAreaUserDatabaseInterface[]
   */
  async retrieveAllManagementAreasUsers(
    managementareaId: any,
    userId: any
  ): Promise<ManagementAreaUserDatabaseInterface[] | null> {
    logger.info("retrieveAllManagementAreasUsers");
    try {
      let result = [];
      if (managementareaId) {
        result = await ManagementAreaUser.findAll({
          where: {
            ManagementAreaId: managementareaId,
          },
        });
      } else if (userId) {
        result = await ManagementAreaUser.findAll({
          where: {
            UserId: userId,
          },
        });
      } else {
        result = await ManagementAreaUser.findAll();
      }
      return result;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }
  /**
   *
   * @param managementareasIds
   * @returns number[], list of users ids from managementareas ids
   */
  async retrieveAllUsersIdsFromManagementAreasIds(
    managementareasIds: number[]
  ): Promise<number[]> {
    logger.info("retrieveAllUsersIdsFromManagementAreasIds");
    try {
      let result = [];
      result = await ManagementAreaUser.findAll({
        attributes: ["UserId"],
        raw: true,
        where: {
          ManagementAreaId: managementareasIds,
        },
      });
      return result.map(raw => raw.UserId);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }
}
