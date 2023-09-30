import { Server } from "http";
import { logger } from "../../../logger";
import { NewBehavior } from "../interfaces/behavior.database";
import { Behavior } from "../models/behavior.model";
import { BehaviorProperty } from "../models/behaviorProperty.model";

export class BehaviorDatabaseService {
  constructor(protected server: Server) {}

  async createOneBehavior(newBehavior: NewBehavior): Promise<Behavior> {
    logger.info("createOneBehavior");
    try {
      return await Behavior.create(newBehavior);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async createBehaviors(newBehaviors: NewBehavior[]): Promise<Behavior[]> {
    logger.info("createBehaviors");
    try {
      return await Behavior.bulkCreate(newBehaviors);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveAllBehaviors(): Promise<Behavior[] | null> {
    logger.info("retrieveAllBehaviors");
    try {
      return await Behavior.findAll({
        include: [
          {
            model: BehaviorProperty,
            through: { attributes: [] },
          },
        ],
      });
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveDefaultBehaviorFromEquipmentTypeId(
    equipmentTypeId: any
  ): Promise<Behavior | null> {
    logger.info("retrieveDefaultBehaviorFromEquipmentTypeId");
    try {
      const result = await Behavior.findOne({
        where: {
          equipmentTypeId,
          isDefault: true,
        },
        include: [
          {
            model: BehaviorProperty,
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

  async retrieveOneBehavior(id: string): Promise<Behavior | null> {
    logger.info("retrieveOneBehavior");
    try {
      const result = await Behavior.findByPk(id, {
        include: [
          {
            model: BehaviorProperty,
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

  async deleteAllBehaviors(data?: { ids: number[] }): Promise<void> {
    logger.info("deleteAllBehaviors");
    try {
      await Behavior.destroy({
        where: data?.ids ? { id: data.ids } : {},
      });
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async deleteOneBehavior(id: string): Promise<void> {
    logger.info("deleteOneBehavior");
    try {
      await Behavior.destroy({
        where: {
          id,
        },
      });
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }
}
