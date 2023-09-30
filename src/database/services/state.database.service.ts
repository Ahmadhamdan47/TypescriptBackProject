import { Server } from "http";
import { logger } from "../../../logger";
import { NewState } from "../interfaces/state.database";
import { Param } from "../models/param.model";
import { State } from "../models/state.model";

export class StateDatabaseService {
  constructor(protected server: Server) {}

  async createOneState(newState: NewState): Promise<State> {
    logger.info("createOneState");
    try {
      return await State.create(newState);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async createStates(newStates: NewState[]): Promise<State[]> {
    logger.info("createStates");
    try {
      return await State.bulkCreate(newStates);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async updateState(stateId: string, newState: NewState): Promise<void> {
    logger.info("updateState");
    try {
      await State.update(newState, {
        where: {
          id: stateId,
        },
      });
      return;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveAllStates(name: any): Promise<State[] | null> {
    logger.info("retrieveAllStates");
    try {
      if (name) {
        return await State.findAll({
          where: {
            name,
          },
        });
      } else {
        return await State.findAll();
      }
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveAllStatesFromIds(ids: any): Promise<State[] | null> {
    logger.info("retrieveAllStatesFromIds");
    try {
      let result = [];
      result = await State.findAll({
        where: {
          id: ids,
        },
        include: [
          {
            model: Param,
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

  async retrieveStatesFromEquipmentsPropertiesIds(
    equipmentsPropertiesIds: number[]
  ): Promise<State[]> {
    logger.info("retrieveStatesFromEquipmentsPropertiesIds");
    try {
      return await State.findAll({
        where: {
          equipmentPropertyId: equipmentsPropertiesIds,
        },
        include: [
          {
            model: Param,
            through: { attributes: [] },
          },
        ],
      });
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveAllStatesIdsFromEquipmentsPropertiesIds(
    equipmentsPropertiesIds: number[]
  ): Promise<number[]> {
    logger.info("retrieveAllStatesIdsFromEquipmentsPropertiesIds");
    try {
      let result = [];
      result = await State.findAll({
        attributes: ["id"],
        where: {
          equipmentPropertyId: equipmentsPropertiesIds,
        },
      });
      return result.map(raw => raw.id);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveOneState(id: string): Promise<State | null> {
    logger.info("retrieveOneState");
    try {
      const result = await State.findByPk(id);
      return result;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async deleteStatesFromIds(data?: { ids: number[] }): Promise<void> {
    logger.info("deleteStatesFromIds");
    try {
      await State.destroy({
        where: data?.ids ? { id: data.ids } : {},
      });
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }
}
