import {
  FeatureDatabaseInterface,
  NewFeature,
} from "../interfaces/feature.database";
import { Feature } from "../models/feature.model";
import { Server } from "http";
import { Op } from "sequelize";
import { Role } from "../models/role.model";
import { logger } from "../../../logger";
import { NewRoleFeature } from "../interfaces/roleFeature.database";
import { RoleFeatureDatabaseService } from "./roleFeature.database.service";

export class FeatureDatabaseService {
  constructor(protected server: Server) {}
  roleFeatureService = new RoleFeatureDatabaseService(this.server);

  async createOneFeature(
    newFeature: NewFeature
  ): Promise<FeatureDatabaseInterface> {
    logger.info("createOneFeature");
    try {
      const result = await Feature.create(newFeature);

      const rolesFeaturesIds = newFeature.roleIds?.map(roleId => ({
        FeatureId: result.id,
        RoleId: roleId,
      }));
      if (rolesFeaturesIds) {
        await this.addRoles(rolesFeaturesIds);
      }

      return result;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async updateFeature(
    featureId: string,
    newFeature: NewFeature
  ): Promise<void> {
    logger.info("updateFeature");
    let result: Feature;
    try {
      await Feature.update(newFeature, {
        where: {
          idFeature: featureId,
        },
      });
      return;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveAllFeatures(name: any): Promise<Feature[]> {
    logger.info("retrieveAllFeatures");
    let result: Feature[];
    let condition: any;
    try {
      condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
      result = await Feature.findAll({
        where: condition,
        include: [
          { model: Role, attributes: ["name"], through: { attributes: [] } },
        ],
      });
      return result;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveOneFeature(id: string): Promise<Feature | null> {
    logger.info("retrieveOneFeature");
    try {
      const result = await Feature.findByPk(id);
      return result;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async deleteAllFeatures(): Promise<void> {
    logger.info("deleteAllFeatures");
    try {
      await Feature.destroy({
        where: {},
        truncate: false,
      });
      return;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async deleteOneFeature(id: string): Promise<void> {
    logger.info("deleteOneFeature");
    try {
      await Feature.destroy({
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

  // link Roles to feature
  async addRoles(ids: NewRoleFeature[]) {
    logger.info("addRoles");
    await this.roleFeatureService.createRolesFeatures(ids);
  }
}
