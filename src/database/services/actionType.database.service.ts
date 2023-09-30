import { Server } from "http";
import { logger } from "../../../logger";
import { NewActionType } from "../interfaces/actionType.database";
import { Param } from "../models/param.model";
import { ActionType } from "../models/actionType.model";

export class ActionTypeDatabaseService {
  constructor(protected server: Server) {}

  async createOneActionType(newActionType: NewActionType): Promise<ActionType> {
    logger.info("createOneActionType");
    try {
      return await ActionType.create(newActionType);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async createActionsTypes(
    newActionsTypes: NewActionType[]
  ): Promise<ActionType[]> {
    logger.info("createActionsTypes");
    try {
      return await ActionType.bulkCreate(newActionsTypes);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async updateActionType(
    actionTypeId: string,
    newActionType: NewActionType
  ): Promise<void> {
    logger.info("updateActionType");
    try {
      await ActionType.update(newActionType, {
        where: {
          actionTypeId: actionTypeId,
        },
      });
      return;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveAllActionsTypes(): Promise<ActionType[] | null> {
    logger.info("retrieveAllActionsTypes");
    try {
      let result = [];
      result = await ActionType.findAll();
      return result;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveAllActionsTypesFromIds(
    ids: number[]
  ): Promise<ActionType[] | null> {
    logger.info("retrieveAllActionsTypesFromIds");
    try {
      let result = [];
      result = await ActionType.findAll({
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

  async retrieveActionsTypesFromEquipmentsPropertiesIds(
    equipmentsPropertiesIds: number[]
  ): Promise<ActionType[]> {
    logger.info("retrieveActionsTypesFromEquipmentsPropertiesIds");
    try {
      return await ActionType.findAll({
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

  async retrieveAllActionsTypesIdsFromEquipmentsPropertiesIds(
    equipmentsPropertiesIds: number[]
  ): Promise<number[]> {
    logger.info("retrieveAllActionsTypesIdsFromEquipmentsPropertiesIds");
    try {
      let result = [];
      result = await ActionType.findAll({
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

  async retrieveOneActionType(id: string): Promise<ActionType | null> {
    logger.info("retrieveOneActionType");
    try {
      const result = await ActionType.findByPk(id);
      return result;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async deleteActionsTypesFromIds(data?: { ids: number[] }): Promise<void> {
    logger.info("deleteActionsTypesFromIds");
    try {
      await ActionType.destroy({
        where: data?.ids ? { id: data.ids } : {},
      });
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }
}
