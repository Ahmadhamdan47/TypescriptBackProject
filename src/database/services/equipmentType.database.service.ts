import { Server } from "http";
import { logger } from "../../../logger";
import { NewEquipmentType } from "../interfaces/equipmentType.database";
import { EquipmentType } from "../models/equipmentType.model";

export class EquipmentTypeDatabaseService {
  constructor(protected server: Server) {}

  async createOneEquipmentType(
    newEquipmentType: NewEquipmentType
  ): Promise<EquipmentType> {
    logger.info("createOneEquipmentType");
    try {
      return await EquipmentType.create(newEquipmentType);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async createEquipmentsTypes(
    newEquipmentsTypes: NewEquipmentType[]
  ): Promise<EquipmentType[]> {
    logger.info("createEquipmentsTypes");
    try {
      return await EquipmentType.bulkCreate(newEquipmentsTypes);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async updateEquipmentType(
    id: string,
    newEquipmentType: NewEquipmentType
  ): Promise<void> {
    logger.info("updateEquipmentType");
    try {
      await EquipmentType.update(newEquipmentType, {
        where: {
          id,
        },
      });
      return;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveAllEquipmentsTypes(
    systemId: any
  ): Promise<EquipmentType[] | null> {
    logger.info("retrieveAllEquipmentsTypes");
    try {
      let result = [];
      if (systemId) {
        result = await EquipmentType.findAll({
          where: {
            systemId: systemId,
          },
        });
      } else {
        result = await EquipmentType.findAll();
      }
      return result;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveEquipmentTypeFromSystemIdAndName(
    systemId: any,
    name: any
  ): Promise<EquipmentType | null> {
    logger.info("retrieveEquipmentTypeFromSystemIdAndName");
    try {
      return await EquipmentType.findOne({
        where: {
          systemId: systemId,
          name,
        },
      });
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveAllEquipmentsTypesIdsFromSystemId(
    systemId: any
  ): Promise<number[] | null> {
    logger.info("retrieveAllEquipmentsTypesIdsFromSystemId");
    try {
      let result = [];
      result = await EquipmentType.findAll({
        attributes: ["id"],
        raw: true,
        where: {
          systemId: systemId,
        },
      });
      return result.map(raw => raw.id);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveOneEquipmentType(id: string): Promise<EquipmentType | null> {
    logger.info("retrieveOneEquipmentType");
    try {
      const result = await EquipmentType.findByPk(id);
      return result;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveEquipmentsTypesFromIds(
    ids: number[]
  ): Promise<EquipmentType[] | null> {
    logger.info("retrieveEquipmentsTypesFromIds");
    try {
      return await EquipmentType.findAll({
        where: {
          id: ids,
        },
      });
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }
}
