import { Server } from "http";
import { Op } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import { NewEquipment } from "../interfaces/equipment.database";
import { Equipment } from "../models/equipment.model";
import { XtvisionEquipmentConfigDatabaseService } from "./xtvisionEquipmentConfig.database.service";
import { NewXtvisionEquipmentConfig } from "../interfaces/xtvisionEquipmentConfig.database";
import { logger } from "../../../logger";
import { LINKED } from "../../server/resources/constants";
import { XtvisionEquipmentConfig } from "../models/xtvisionEquipmentConfig.model";
import { EquipmentFilter } from "../../server/interfaces/equipmentsFilter";
import { EquipmentBrandDatabaseService } from "./equipmentBrand.database.service";
import { EquipmentTypeDatabaseService } from "./equipmentType.database.service";
import {
  PaginationQueryDatabaseInterface,
  PaginationSequelizeDatabaseInterface,
} from "../interfaces/pagination.database";

export class EquipmentDatabaseService {
  constructor(protected server: Server) {}
  serviceXtvisionEquipmentConfig = new XtvisionEquipmentConfigDatabaseService(
    this.server
  );
  serviceEquipmentBrand = new EquipmentBrandDatabaseService(this.server);
  serviceEquipmentType = new EquipmentTypeDatabaseService(this.server);

  /**
   * Create one equipment and its xtvision config
   */
  async createOneEquipment(newEquipment: NewEquipment): Promise<Equipment> {
    logger.info("createOneEquipment");
    try {
      const equipmentDb = await Equipment.create(newEquipment);
      // Init Xtvision conf for equipment
      const xtvisionEquipmentConfig = {
        equipmentId: equipmentDb.id,
        isSupervised: false,
      } as NewXtvisionEquipmentConfig;
      await this.serviceXtvisionEquipmentConfig.createOneXtvisionEquipmentConfig(
        xtvisionEquipmentConfig
      );
      return equipmentDb;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  /**
   * Create some equipments and their xtvision configs
   */
  async createEquipments(newEquipments: NewEquipment[]): Promise<Equipment[]> {
    logger.info("createEquipments");
    try {
      const equipmentsDb = await Equipment.bulkCreate(newEquipments);
      // Init Xtvision conf for each equipment
      const xtvisionEquipmentConfigs: NewXtvisionEquipmentConfig[] = [];
      equipmentsDb.forEach(equip => {
        xtvisionEquipmentConfigs.push({
          equipmentId: equip.id,
          isSupervised: false,
        } as NewXtvisionEquipmentConfig);
      });
      await this.serviceXtvisionEquipmentConfig.createXtvisionEquipmentConfigs(
        xtvisionEquipmentConfigs
      );
      return equipmentsDb;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  /**
   * Retrive all equipments with pagination or not.
   * OR
   * For BackEnd necessity, retrieve equipments from systemId and status.
   */
  async retrieveAllEquipments(
    systemId: any,
    status: any,
    pagination: PaginationQueryDatabaseInterface
  ): Promise<Equipment[] | PaginationSequelizeDatabaseInterface | null> {
    logger.info("retrieveAllEquipments");
    try {
      let result: Equipment[] | PaginationSequelizeDatabaseInterface | null =
        [];
      if (systemId) {
        const equipmentsBrandsIds =
          await this.serviceEquipmentBrand.retrieveAllEquipmentsBrandsIdsFromSystemId(
            systemId
          );
        if (equipmentsBrandsIds) {
          result = await this.retrieveEquipmentsFromEquipmentsBrandsIds(
            equipmentsBrandsIds,
            status
          );
        }
      } else if (pagination.size) {
        result = await Equipment.findAndCountAll({
          include: XtvisionEquipmentConfig,
          offset: Number(pagination.offset),
          limit: Number(pagination.size),
        });
      } else {
        result = await Equipment.findAll({
          include: XtvisionEquipmentConfig,
        });
      }
      return result;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  /**
   * Retrieve equipments from equipments brands ids order by brands
   */
  async retrieveEquipmentsFromEquipmentsBrandsIds(
    equipmentsBrandsIds: number[],
    status: any
  ): Promise<Equipment[] | null> {
    logger.info("retrieveEquipmentsFromEquipmentsBrandsIds");
    try {
      const conditions = [];
      conditions.push({ equipmentBrandId: equipmentsBrandsIds });
      if (status) {
        conditions.push({ status: status });
      }
      return await Equipment.findAll({
        where: conditions,
        order: Sequelize.col("equipmentBrandId"),
        include: XtvisionEquipmentConfig,
      });
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  /**
   * Retrieve equipments from filters and with pagination or not
   */
  async retrieveEquipmentsByFilters(
    filters: EquipmentFilter,
    pagination: PaginationQueryDatabaseInterface
  ): Promise<Equipment[] | PaginationSequelizeDatabaseInterface | null> {
    logger.info("retrieveEquipmentsByFilters");
    try {
      const conditions = [];
      if (filters.systemId) {
        const typesIds =
          await this.serviceEquipmentType.retrieveAllEquipmentsTypesIdsFromSystemId(
            filters.systemId
          );
        if (typesIds) {
          filters.typesIds = filters.typesIds.concat(typesIds);
        }
      }
      if (filters.typesIds) {
        const equipmentsBrandsIds =
          await this.serviceEquipmentBrand.retrieveAllEquipmentsBrandsIdsFromEquipmentsTypesIds(
            filters.typesIds
          );
        if (equipmentsBrandsIds) {
          conditions.push({ equipmentBrandId: equipmentsBrandsIds });
        }
      }
      if (filters.ids) {
        conditions.push({ id: filters.ids });
      }
      if (filters.name) {
        conditions.push({ name: { [Op.like]: `%${filters.name}%` } });
      }
      if (filters.canReceiveTextMessage) {
        conditions.push({
          canReceiveTextMessage: filters.canReceiveTextMessage,
        });
      }
      if (filters.domainId) {
        conditions.push({
          domainId: filters.domainId,
        });
      }
      let conditionWhere: any;
      if (pagination.size) {
        conditionWhere = {
          where: conditions,
          offset: Number(pagination.offset),
          limit: Number(pagination.size),
        };
        return await Equipment.findAndCountAll(conditionWhere);
      } else {
        conditionWhere = {
          where: conditions,
        };
        return await Equipment.findAll(conditionWhere);
      }
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  /**
   * Retrieve one equipment by id
   */
  async retrieveOneEquipment(id: string): Promise<Equipment | null> {
    logger.info("retrieveOneEquipment");
    try {
      const result = await Equipment.findByPk(id, {
        include: XtvisionEquipmentConfig,
      });
      return result;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  /**
   * Retrieve some equipments by systemId and gids
   */
  async retrieveEquipmentsByGidsAndSystemId(
    gids: number[],
    systemId: any
  ): Promise<Equipment[]> {
    logger.info("retrieveEquipmentsByGidsAndSystemId");
    try {
      const equipmentsBrandsIds =
        await this.serviceEquipmentBrand.retrieveAllEquipmentsBrandsIdsFromSystemId(
          systemId
        );
      return await Equipment.findAll({
        where: {
          gid: gids,
          equipmentBrandId: equipmentsBrandsIds,
          status: LINKED,
        },
        include: XtvisionEquipmentConfig,
      });
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  /**
   * Retrieve one equipment by systemId and gid
   */
  async retrieveOneEquipmentByGidAndSystemId(
    gid: string,
    systemId: any
  ): Promise<Equipment | null> {
    logger.info("retrieveOneEquipmentByGidAndSystemId");
    let result: Equipment | null = null;
    try {
      const equipmentsBrandsIds =
        await this.serviceEquipmentBrand.retrieveAllEquipmentsBrandsIdsFromSystemId(
          systemId
        );
      if (equipmentsBrandsIds) {
        result = await Equipment.findOne({
          where: {
            gid,
            equipmentBrandId: equipmentsBrandsIds,
            status: LINKED,
          },
          include: XtvisionEquipmentConfig,
        });
      }
      return result;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  /**
   * Delete all equipments or equipment with specific gid
   */
  async deleteAllEquipments(gid: any): Promise<void> {
    logger.info("deleteAllEquipments");
    try {
      if (gid) {
        // Delete cascade for xtvisionEquipmentConfig and current equipment state
        await Equipment.destroy({
          where: {
            gid,
          },
        });
      } else {
        // Delete cascade for xtvisionEquipmentConfig and current equipment state
        await Equipment.destroy({
          where: {},
          truncate: false,
        });
      }
      return;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  /**
   * Update an equipment
   */
  async updateEquipment(id: string, attributesToUpdate: any): Promise<void> {
    logger.info("updateEquipment");
    try {
      await Equipment.update(attributesToUpdate, {
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

  /**
   * Update some equipments
   */
  async updateEquipments(attributesToUpdate: any): Promise<void> {
    logger.info("updateEquipments");
    try {
      await Equipment.update(attributesToUpdate.equipment, {
        where: {
          id: attributesToUpdate.equipmentsIds,
        },
      });
      return;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  /**
   * Delete one equipment by id
   */
  async deleteOneEquipment(id: string): Promise<void> {
    logger.info("deleteOneEquipment");
    try {
      // Delete cascade for xtvisionEquipmentConfig and current equipment state
      await Equipment.destroy({
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
