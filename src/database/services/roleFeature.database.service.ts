import { Server } from "http";
import { logger } from "../../../logger";
import {
  NewRoleFeature,
  RoleFeatureDatabaseInterface,
} from "../interfaces/roleFeature.database";
import { RoleFeature } from "../models/roleFeature.model";

/**
 * This database is the link between roles and features: each row takes a role id and a feature id.
 */
export class RoleFeatureDatabaseService {
  constructor(protected server: Server) {}

  /**
   * creates a list of links
   * @param newRolesFeatures object containing a role id and a feature id
   * @returns RoleFeatureDatabaseInterface[]
   */
  async createRolesFeatures(
    newRolesFeatures: NewRoleFeature[]
  ): Promise<RoleFeatureDatabaseInterface[]> {
    logger.info("createRolesFeatures");
    try {
      return await RoleFeature.bulkCreate(newRolesFeatures);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  /**
   * retrieves all links between roles and features
   * @param roleId if set, retrieves links correspoding to that role
   * @param featureId if set, retrieves links correspoding to that feature
   * @returns RoleFeatureDatabaseInterface[]
   */
  async retrieveAllRolesFeatures(
    roleId: any,
    featureId: any
  ): Promise<RoleFeatureDatabaseInterface[] | null> {
    logger.info("retrieveAllRolesFeatures");
    try {
      let result = [];
      if (roleId) {
        result = await RoleFeature.findAll({
          where: {
            RoleId: roleId,
          },
        });
      } else if (featureId) {
        result = await RoleFeature.findAll({
          where: {
            FeatureId: featureId,
          },
        });
      } else {
        result = await RoleFeature.findAll();
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
   * @returns number[], list of features ids from roles ids
   */
  async retrieveAllFeaturesIdsFromRolesIds(
    rolesIds: number[]
  ): Promise<number[]> {
    logger.info("retrieveAllFeaturesIdsFromRolesIds");
    try {
      let result = [];
      result = await RoleFeature.findAll({
        attributes: ["FeatureId"],
        raw: true,
        where: {
          RoleId: rolesIds,
        },
      });
      return result.map(raw => raw.FeatureId);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }
}
