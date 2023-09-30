import { Server } from "http";
import { logger } from "../../../logger";
import { NewEquipmentProperty } from "../interfaces/equipmentProperty.database";
import { EquipmentProperty } from "../models/equipmentProperty.model";
import { EquipmentTypeEquipmentPropertyDatabaseService } from "./equipmentTypeEquipmentProperty.database.service";

export class EquipmentPropertyDatabaseService {
  constructor(protected server: Server) {}
  serviceEquipmentTypeEquipmentProperty =
    new EquipmentTypeEquipmentPropertyDatabaseService(this.server);

  async createOneEquipmentProperty(
    newEquipmentProperty: NewEquipmentProperty
  ): Promise<EquipmentProperty> {
    logger.info("createOneEquipmentProperty");
    try {
      return await EquipmentProperty.create(newEquipmentProperty);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async createEquipmentProperties(
    newEquipmentProperties: NewEquipmentProperty[]
  ): Promise<EquipmentProperty[]> {
    logger.info("createEquipmentProperties");
    try {
      return await EquipmentProperty.bulkCreate(newEquipmentProperties);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async updateEquipmentProperty(
    equipmentPropertyId: string,
    newEquipmentProperty: NewEquipmentProperty
  ): Promise<void> {
    logger.info("updateEquipmentProperty");
    try {
      await EquipmentProperty.update(newEquipmentProperty, {
        where: {
          id: equipmentPropertyId,
        },
      });
      return;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveEquipmentsProperties(
    equipmentTypeId: any
  ): Promise<EquipmentProperty[] | null> {
    logger.info("retrieveEquipmentsProperties");
    try {
      if (equipmentTypeId) {
        const equipmentsPropertiesIds =
          await this.serviceEquipmentTypeEquipmentProperty.retrieveAllEquipmentPropertiesIdsFromEquipmentsTypesIds(
            Array.from(new Array(1), () => Number(equipmentTypeId))
          );
        return await EquipmentProperty.findAll({
          where: {
            id: equipmentsPropertiesIds,
          },
        });
      } else {
        return await EquipmentProperty.findAll();
      }
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveOneEquipmentProperty(
    id: string
  ): Promise<EquipmentProperty | null> {
    logger.info("retrieveOneEquipmentProperty");
    try {
      const result = await EquipmentProperty.findByPk(id);
      return result;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async deleteEquipmentPropertiesFromIds(data?: {
    ids: number[];
  }): Promise<void> {
    logger.info("deleteEquipmentPropertiesFromIds");
    try {
      await EquipmentProperty.destroy({
        where: data?.ids ? { id: data.ids } : {},
      });
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async deleteOneEquipmentProperty(id: string): Promise<void> {
    logger.info("deleteOneEquipmentProperty");
    try {
      await EquipmentProperty.destroy({
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
