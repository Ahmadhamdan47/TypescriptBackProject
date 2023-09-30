import { Server } from "http";
import { logger } from "../../../logger";
import {
  NewEquipmentTypeEquipmentProperty,
  EquipmentTypeEquipmentPropertyDatabaseInterface,
} from "../interfaces/equipmentTypeEquipmentProperty.database";
import { EquipmentTypeEquipmentProperty } from "../models/equipmentTypeEquipmentProperty.model";

export class EquipmentTypeEquipmentPropertyDatabaseService {
  constructor(protected server: Server) {}

  async createEquipmentsTypesEquipmentProperties(
    newEquipmentsTypesEquipmentProperties: NewEquipmentTypeEquipmentProperty[]
  ): Promise<EquipmentTypeEquipmentPropertyDatabaseInterface[]> {
    logger.info("createEquipmentsTypesEquipmentProperties");
    try {
      return await EquipmentTypeEquipmentProperty.bulkCreate(
        newEquipmentsTypesEquipmentProperties
      );
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveAllEquipmentsTypesEquipmentProperties(
    equipmentTypeId: any,
    equipmentPropertyId: any
  ): Promise<EquipmentTypeEquipmentPropertyDatabaseInterface[] | null> {
    logger.info("retrieveAllEquipmentsTypesEquipmentProperties");
    try {
      let result = [];
      if (equipmentTypeId) {
        result = await EquipmentTypeEquipmentProperty.findAll({
          where: {
            EquipmentTypeId: equipmentTypeId,
          },
        });
      } else if (equipmentPropertyId) {
        result = await EquipmentTypeEquipmentProperty.findAll({
          where: {
            EquipmentPropertyId: equipmentPropertyId,
          },
        });
      } else {
        result = await EquipmentTypeEquipmentProperty.findAll();
      }
      return result;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveAllEquipmentPropertiesIdsFromEquipmentsTypesIds(
    equipmentsTypesIds: number[]
  ): Promise<number[]> {
    logger.info("retrieveAllEquipmentPropertiesIdsFromEquipmentsTypesIds");
    try {
      let result = [];
      result = await EquipmentTypeEquipmentProperty.findAll({
        attributes: ["EquipmentPropertyId"],
        raw: true,
        where: {
          EquipmentTypeId: equipmentsTypesIds,
        },
      });
      return result.map(raw => raw.EquipmentPropertyId);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }
}
