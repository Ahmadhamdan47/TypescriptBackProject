import { Server } from "http";
import { logger } from "../../../logger";
import { NewBehaviorBehaviorProperty } from "../interfaces/behaviorBehaviorProperty.database";
import { BehaviorBehaviorProperty } from "../models/behaviorBehaviorProperty.model";

export class BehaviorBehaviorPropertyDatabaseService {
  constructor(protected server: Server) {}

  async createBehaviorsBehaviorsProperties(
    newBehaviorsBehaviorsProperties: NewBehaviorBehaviorProperty[]
  ): Promise<BehaviorBehaviorProperty[]> {
    logger.info("createBehaviorsBehaviorsProperties");
    try {
      return await BehaviorBehaviorProperty.bulkCreate(
        newBehaviorsBehaviorsProperties
      );
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveAllBehaviorsBehaviorsProperties(
    behaviorId: any,
    behaviorPropertyId: any
  ): Promise<BehaviorBehaviorProperty[] | null> {
    logger.info("retrieveAllBehaviorsBehaviorsProperties");
    try {
      let result = [];
      if (behaviorId) {
        result = await BehaviorBehaviorProperty.findAll({
          where: {
            BehaviorId: behaviorId,
          },
        });
      } else if (behaviorPropertyId) {
        result = await BehaviorBehaviorProperty.findAll({
          where: {
            BehaviorPropertyId: behaviorPropertyId,
          },
        });
      } else {
        result = await BehaviorBehaviorProperty.findAll();
      }
      return result;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveAllBehaviorsPropertiesIdsFromBehaviorsIds(
    behaviorsIds: number[]
  ): Promise<number[]> {
    logger.info("retrieveAllBehaviorsPropertiesIdsFromBehaviorsIds");
    try {
      let result = [];
      result = await BehaviorBehaviorProperty.findAll({
        attributes: ["BehaviorPropertyId"],
        raw: true,
        where: {
          BehaviorId: behaviorsIds,
        },
      });
      return result.map(raw => raw.BehaviorPropertyId);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }
}
