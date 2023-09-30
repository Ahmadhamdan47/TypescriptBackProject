import { Server } from "http";
import { NewCurrentEquipmentState } from "../interfaces/currentEquipmentState.database";
import { CurrentEquipmentState } from "../models/currentEquipmentState.model";
import { logger } from "../../../logger";

export class CurrentEquipmentStateDatabaseService {
  constructor(protected server: Server) {}

  async createOneCurrentEquipmentState(
    newCurrentEquipmentState: NewCurrentEquipmentState
  ): Promise<CurrentEquipmentState> {
    logger.info("createOneCurrentEquipmentState");
    try {
      return await CurrentEquipmentState.create(newCurrentEquipmentState);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async createCurrentEquipmentStates(
    newCurrentEquipmentStates: NewCurrentEquipmentState[]
  ): Promise<CurrentEquipmentState[]> {
    logger.info("createCurrentEquipmentStates");
    try {
      return await CurrentEquipmentState.bulkCreate(newCurrentEquipmentStates);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async updateCurrentEquipmentState(
    id: string,
    newCurrentEquipmentState: NewCurrentEquipmentState
  ): Promise<void> {
    logger.info("updateCurrentEquipmentState");
    try {
      await CurrentEquipmentState.update(newCurrentEquipmentState, {
        where: {
          equipmentId: id,
          equipmentPropertyId: newCurrentEquipmentState.equipmentPropertyId,
        },
      });
      return;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async updateCurrentsEquipmentsStates(
    newCurrentsEquipmentsStates: NewCurrentEquipmentState[]
  ): Promise<void> {
    logger.info("updateCurrentsEquipmentsStates");
    try {
      await Promise.all(
        newCurrentsEquipmentsStates.map(async newCurrentEquipmentState => {
          if (
            await CurrentEquipmentState.findOne({
              where: {
                equipmentId: newCurrentEquipmentState.equipmentId,
                equipmentPropertyId:
                  newCurrentEquipmentState.equipmentPropertyId,
              },
            })
          ) {
            // Update if object is already in database
            await CurrentEquipmentState.update(newCurrentEquipmentState, {
              where: {
                equipmentId: newCurrentEquipmentState.equipmentId,
                equipmentPropertyId:
                  newCurrentEquipmentState.equipmentPropertyId,
              },
            });
          } else {
            // Create if object not exists
            await CurrentEquipmentState.create(newCurrentEquipmentState);
          }
        })
      );
      return;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveAllCurrentEquipmentStates(
    equipmentId: any
  ): Promise<CurrentEquipmentState[] | null> {
    logger.info("retrieveAllCurrentEquipmentStates");
    try {
      if (equipmentId) {
        return await CurrentEquipmentState.findAll({
          where: {
            equipmentId,
          },
        });
      } else {
        return await CurrentEquipmentState.findAll();
      }
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveOneCurrentEquipmentState(
    id: string
  ): Promise<CurrentEquipmentState | null> {
    logger.info("retrieveOneCurrentEquipmentState");
    try {
      const result = await CurrentEquipmentState.findByPk(id);
      return result;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async deleteAllCurrentEquipmentStates(): Promise<void> {
    logger.info("deleteAllCurrentEquipmentStates");
    try {
      await CurrentEquipmentState.destroy({
        where: {},
        truncate: false,
      });
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async deleteOneCurrentEquipmentState(id: string): Promise<void> {
    logger.info("deleteOneCurrentEquipmentState");
    try {
      await CurrentEquipmentState.destroy({
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
