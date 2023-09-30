import { Server } from "http";
import { logger } from "../../../logger";
import {
  NewRoleUser,
  RoleUserDatabaseInterface,
} from "../interfaces/roleUser.database";
import { RoleUser } from "../models/roleUser.model";

/**
 * This database is the link between roles and users: each row takes a role id and a user id.
 */
export class RoleUserDatabaseService {
  constructor(protected server: Server) {}

  /**
   * creates a list of links
   * @param newRolesUsers object containing a role id and a user id
   * @returns RoleUserDatabaseInterface[]
   */
  async createRolesUsers(
    newRolesUsers: NewRoleUser[]
  ): Promise<RoleUserDatabaseInterface[]> {
    logger.info("createRolesUsers");
    try {
      return await RoleUser.bulkCreate(newRolesUsers);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  /**
   * retrieves all links between roles and users
   * @param roleId if set, retrieves links correspoding to that role
   * @param userId if set, retrieves links correspoding to that user
   * @returns RoleUserDatabaseInterface[]
   */
  async retrieveAllRolesUsers(
    roleId: any,
    userId: any
  ): Promise<RoleUserDatabaseInterface[] | null> {
    logger.info("retrieveAllRolesUsers");
    try {
      let result = [];
      if (roleId) {
        result = await RoleUser.findAll({
          where: {
            RoleId: roleId,
          },
        });
      } else if (userId) {
        result = await RoleUser.findAll({
          where: {
            UserId: userId,
          },
        });
      } else {
        result = await RoleUser.findAll();
      }
      return result;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }
  /**
   *
   * @param rolesIds
   * @returns number[], list of users ids from roles ids
   */
  async retrieveAllUsersIdsFromRolesIds(rolesIds: number[]): Promise<number[]> {
    logger.info("retrieveAllUsersIdsFromRolesIds");
    try {
      let result = [];
      result = await RoleUser.findAll({
        attributes: ["UserId"],
        raw: true,
        where: {
          RoleId: rolesIds,
        },
      });
      return result.map(raw => raw.UserId);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }
}
