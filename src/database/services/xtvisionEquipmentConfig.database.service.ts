import { Server } from "http";
import { logger } from "../../../logger";
import { NewXtvisionEquipmentConfig } from "../interfaces/xtvisionEquipmentConfig.database";
import { XtvisionEquipmentConfig } from "../models/xtvisionEquipmentConfig.model";

export class XtvisionEquipmentConfigDatabaseService {
  constructor(protected server: Server) {}

  async createOneXtvisionEquipmentConfig(
    newXtvisionEquipmentConfig: NewXtvisionEquipmentConfig
  ): Promise<XtvisionEquipmentConfig> {
    logger.info("createOneXtvisionEquipmentConfig");
    try {
      return await XtvisionEquipmentConfig.create(newXtvisionEquipmentConfig);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async createXtvisionEquipmentConfigs(
    newXtvisionEquipmentConfigs: NewXtvisionEquipmentConfig[]
  ): Promise<XtvisionEquipmentConfig[]> {
    logger.info("createXtvisionEquipmentConfigs");
    try {
      return await XtvisionEquipmentConfig.bulkCreate(
        newXtvisionEquipmentConfigs
      );
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async updateXtvisionEquipmentConfig(
    id: string,
    newXtvisionEquipmentConfig: any
  ): Promise<void> {
    logger.info("updateXtvisionEquipmentConfig");
    try {
      await XtvisionEquipmentConfig.update(newXtvisionEquipmentConfig, {
        where: {
          equipmentId: id,
        },
      });
      return;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async updateXtvisionEquipmentsConfigs(
    attributesToUpdate: any
  ): Promise<void> {
    logger.info("updateXtvisionEquipmentsConfigs");
    try {
      await XtvisionEquipmentConfig.update(
        attributesToUpdate.xtvisionEquipmentConfig,
        {
          where: {
            equipmentId: attributesToUpdate.equipmentsIds,
          },
        }
      );
      return;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveAllXtvisionEquipmentConfigs(): Promise<
    XtvisionEquipmentConfig[] | null
  > {
    logger.info("retrieveAllXtvisionEquipmentConfigs");
    try {
      let result = [];
      result = await XtvisionEquipmentConfig.findAll();
      return result;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveAllXtvisionEquipmentConfigsFromIds(
    ids: any
  ): Promise<XtvisionEquipmentConfig[] | null> {
    logger.info("retrieveAllXtvisionEquipmentConfigsFromIds");
    try {
      let result = [];
      result = await XtvisionEquipmentConfig.findAll({
        where: {
          equipmentId: ids,
        },
      });
      return result;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveOneXtvisionEquipmentConfig(
    id: string
  ): Promise<XtvisionEquipmentConfig | null> {
    logger.info("retrieveOneXtvisionEquipmentConfig");
    try {
      const result = await XtvisionEquipmentConfig.findByPk(id);
      return result;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async deleteXtvisionEquipmentConfigsFromIds(data?: {
    ids: number[];
  }): Promise<void> {
    logger.info("deleteXtvisionEquipmentConfigsFromIds");
    try {
      await XtvisionEquipmentConfig.destroy({
        where: data?.ids ? { id: data.ids } : {},
      });
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }
}
