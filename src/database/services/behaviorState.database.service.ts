import { Server } from "http";
import { logger } from "../../../logger";
import { NewBehaviorState } from "../interfaces/behaviorState.database";
import { BehaviorState } from "../models/behaviorState.model";

export class BehaviorStateDatabaseService {
  constructor(protected server: Server) {}

  async createOneBehaviorState(
    newBehaviorState: NewBehaviorState
  ): Promise<BehaviorState> {
    logger.info("createOneBehaviorState");
    try {
      return await BehaviorState.create(newBehaviorState);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async createBehaviorsStates(
    newBehaviorsStates: NewBehaviorState[]
  ): Promise<BehaviorState[]> {
    logger.info("createBehaviorsStates");
    try {
      return await BehaviorState.bulkCreate(newBehaviorsStates);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async updateBehaviorState(
    behaviorStateId: string,
    newBehaviorState: NewBehaviorState
  ): Promise<void> {
    logger.info("updateBehaviorState");
    try {
      await BehaviorState.update(newBehaviorState, {
        where: {
          id: behaviorStateId,
        },
      });
      return;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveAllBehaviorsStates(
    behaviorPropertyId: any,
    state: any
  ): Promise<BehaviorState[] | BehaviorState | null> {
    logger.info("retrieveAllBehaviorsStates");
    try {
      let result;
      if (behaviorPropertyId && state) {
        result = await BehaviorState.findOne({
          where: {
            behaviorPropertyId,
            name: state,
          },
        });
      } else {
        result = await BehaviorState.findAll();
      }
      return result;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveAllBehaviorsStatesFromIds(
    ids: any
  ): Promise<BehaviorState[] | null> {
    logger.info("retrieveAllBehaviorsStatesFromIds");
    try {
      let result = [];
      result = await BehaviorState.findAll({
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

  async retrieveOneBehaviorState(id: string): Promise<BehaviorState | null> {
    logger.info("retrieveOneBehaviorState");
    try {
      const result = await BehaviorState.findByPk(id);
      return result;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async deleteBehaviorsStates(data?: { ids: number[] }): Promise<void> {
    logger.info("deleteBehaviorsStates");
    try {
      await BehaviorState.destroy({
        where: data?.ids ? { id: data.ids } : {},
      });
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async deleteBehaviorsStatesFromStatesIds(statesIds: any): Promise<void> {
    logger.info("deleteBehaviorsStatesFromStatesIds");
    try {
      await BehaviorState.destroy({
        where: {
          stateId: statesIds,
        },
      });
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }
}
