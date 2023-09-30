import { Server } from "http";
import { logger } from "../../../logger";
import { NewBehaviorProperty } from "../interfaces/behaviorProperty.database";
import { BehaviorProperty } from "../models/behaviorProperty.model";

export class BehaviorPropertyDatabaseService {
  constructor(protected server: Server) {}

  async createOneBehaviorProperty(
    newBehaviorProperty: NewBehaviorProperty
  ): Promise<BehaviorProperty> {
    logger.info("createOneBehaviorProperty");
    try {
      return await BehaviorProperty.create(newBehaviorProperty);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async createBehaviorsProperties(
    newBehaviorsProperties: NewBehaviorProperty[]
  ): Promise<BehaviorProperty[]> {
    logger.info("createBehaviorsProperties");
    try {
      return await BehaviorProperty.bulkCreate(newBehaviorsProperties);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async updateBehaviorProperty(
    behaviorPropertyId: string,
    newBehaviorProperty: NewBehaviorProperty
  ): Promise<void> {
    logger.info("updateBehaviorProperty");
    try {
      await BehaviorProperty.update(newBehaviorProperty, {
        where: {
          id: behaviorPropertyId,
        },
      });
      return;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveAllBehaviorsProperties(): Promise<BehaviorProperty[] | null> {
    logger.info("retrieveAllBehaviorsProperties");
    try {
      let result = [];
      result = await BehaviorProperty.findAll();
      return result;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveAllBehaviorsPropertiesFromIds(
    ids: any
  ): Promise<BehaviorProperty[] | null> {
    logger.info("retrieveAllBehaviorsPropertiesFromIds");
    try {
      let result = [];
      result = await BehaviorProperty.findAll({
        where: {
          id: ids,
        },
      });
      return result;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveOneBehaviorProperty(
    id: string
  ): Promise<BehaviorProperty | null> {
    logger.info("retrieveOneBehaviorProperty");
    try {
      const result = await BehaviorProperty.findByPk(id);
      return result;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async deleteBehaviorsProperties(data?: { ids: number[] }): Promise<void> {
    logger.info("deleteBehaviorsProperties");
    try {
      await BehaviorProperty.destroy({
        where: data?.ids ? { id: data.ids } : {},
      });
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async deleteBehaviorsPropertiesFromPropertiesIds(
    propertiesIds: any
  ): Promise<void> {
    logger.info("deleteBehaviorsPropertiesFromPropertiesIds");
    try {
      await BehaviorProperty.destroy({
        where: {
          equipmentPropertyId: propertiesIds,
        },
      });
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }
}
