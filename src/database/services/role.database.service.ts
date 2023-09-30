import { NewRole, RoleDatabaseInterface } from "../interfaces/role.database";
import { Role } from "../models/role.model";
import { Server } from "http";
import { Feature } from "../models/feature.model";
import { Op } from "sequelize";
import { User } from "../models/user.model";
import { logger } from "../../../logger";
import { NewRoleFeature } from "../interfaces/roleFeature.database";
import { NewRoleUser } from "../interfaces/roleUser.database";
import { RoleUserDatabaseService } from "./roleUser.database.service";
import { RoleFeatureDatabaseService } from "./roleFeature.database.service";

export class RoleDatabaseService {
  constructor(protected server: Server) {}
  roleUserService = new RoleUserDatabaseService(this.server);
  roleFeatureService = new RoleFeatureDatabaseService(this.server);

  async createOneRole(newRole: NewRole): Promise<RoleDatabaseInterface> {
    logger.info("createOneRole");
    try {
      const result = await Role.create(newRole);
      const rolesUserIds = newRole.userIds?.map(userId => ({
        UserId: userId,
        RoleId: result.id,
      }));
      if (rolesUserIds) {
        await this.addUsers(rolesUserIds);
      }

      const rolesFeatureIds = newRole.featureIds?.map(featureId => ({
        FeatureId: featureId,
        RoleId: result.id,
      }));
      if (rolesFeatureIds) {
        await this.addFeatures(rolesFeatureIds);
      }
      
      return result;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async updateRoleById(id: string, newRole: NewRole): Promise<void> {
    logger.info("updateRoleById");
    try {
      await Role.update(newRole, {
        where: {
          id,
        },
      });
      return;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveAllRoles(name: any): Promise<Role[]> {
    logger.info("retrieveAllRoles");
    let result: Role[];
    let condition: any;
    try {
      condition = name ? { name: { [Op.eq]: `${name}` } } : null;
      result = await Role.findAll({
        where: condition,
        include: [
          { model: Feature, attributes: ["name"], through: { attributes: [] } },
        ],
      });
      return result;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveRolesWithUsers(name: any): Promise<Role[]> {
    logger.info("retrieveRolesWithUsers");
    let result: Role[];
    let condition: any;
    try {
      condition = name ? { name: { [Op.eq]: `${name}` } } : null;
      result = await Role.findAll({
        where: condition,
        include: [
          {
            model: User,
            attributes: ["id", "name"],
            through: { attributes: [] },
          },
        ],
      });
      return result;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveOneRole(id: string): Promise<Role | null> {
    logger.info("retrieveOneRole");
    try {
      const result = await Role.findByPk(id);
      return result;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async deleteAllRoles(): Promise<void> {
    logger.info("deleteAllRoles");
    try {
      await Role.destroy({
        where: {},
        truncate: false,
      });
      return;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async deleteRoleById(id: string): Promise<void> {
    logger.info("deleteRoleById");
    try {
      await Role.destroy({
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

  // link users to Role
  async addUsers(ids: NewRoleUser[]) {
    logger.info("addUsers");
    await this.roleUserService.createRolesUsers(ids);
  }

  // link features to Role
  async addFeatures(ids: NewRoleFeature[]) {
    logger.info("addFeatures");
    await this.roleFeatureService.createRolesFeatures(ids);
  }
}
