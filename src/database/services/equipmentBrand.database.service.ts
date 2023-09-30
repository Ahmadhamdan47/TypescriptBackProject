import { Server } from "http";
import { logger } from "../../../logger";
import { NewEquipmentBrand } from "../interfaces/equipmentBrand.database";
import { EquipmentBrand } from "../models/equipmentBrand.model";
import { EquipmentTypeDatabaseService } from "./equipmentType.database.service";

export class EquipmentBrandDatabaseService {
  constructor(protected server: Server) {}

  serviceEquipmentType = new EquipmentTypeDatabaseService(this.server);

  async createOneEquipmentBrand(
    newEquipmentBrand: NewEquipmentBrand
  ): Promise<EquipmentBrand> {
    logger.info("createOneEquipmentBrand");
    try {
      return await EquipmentBrand.create(newEquipmentBrand);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async createEquipmentsBrands(
    newEquipmentsBrands: NewEquipmentBrand[]
  ): Promise<EquipmentBrand[]> {
    logger.info("createEquipmentsBrands");
    try {
      return await EquipmentBrand.bulkCreate(newEquipmentsBrands);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async updateEquipmentBrand(
    equipmentBrandId: string,
    newEquipmentBrand: NewEquipmentBrand
  ): Promise<void> {
    logger.info("updateEquipmentBrand");
    try {
      await EquipmentBrand.update(newEquipmentBrand, {
        where: {
          id: equipmentBrandId,
        },
      });
      return;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveAllEquipmentsBrands(
    systemId: any
  ): Promise<EquipmentBrand[] | null> {
    logger.info("retrieveAllEquipmentsBrands");
    try {
      let result: EquipmentBrand[] = [];
      if (systemId) {
        const equipmentsTypesIds =
          await this.serviceEquipmentType.retrieveAllEquipmentsTypesIdsFromSystemId(
            systemId
          );
        if (equipmentsTypesIds) {
          result = await EquipmentBrand.findAll({
            where: {
              equipmentTypeId: equipmentsTypesIds,
            },
          });
        }
      } else {
        result = await EquipmentBrand.findAll();
      }
      return result;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveEquipmentsBrandsFromIds(
    ids: number[]
  ): Promise<EquipmentBrand[] | null> {
    logger.info("retrieveEquipmentsBrandsFromIds");
    try {
      return await EquipmentBrand.findAll({
        where: {
          id: ids,
        },
      });
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveEquipmentBrandFromSystemIdAndName(
    systemId: any,
    name: any
  ): Promise<EquipmentBrand | null> {
    logger.info("retrieveEquipmentBrandFromSystemIdAndName");
    try {
      const brands = await this.retrieveAllEquipmentsBrands(systemId);
      const brand = brands?.find(brand => brand.name === name);
      return brand ? brand : null;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveAllEquipmentsBrandsIdsFromSystemId(
    systemId: any
  ): Promise<number[] | null> {
    logger.info("retrieveAllEquipmentsBrandsIdsFromSystemId");
    try {
      const brands = await this.retrieveAllEquipmentsBrands(systemId);
      return brands ? brands.map(raw => raw.id) : null;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveAllEquipmentsBrandsIdsFromEquipmentsTypesIds(
    equipmentsTypesIds: any
  ): Promise<number[] | null> {
    logger.info("retrieveAllEquipmentsBrandsIdsFromEquipmentsTypesIds");
    try {
      return (
        await EquipmentBrand.findAll({
          where: {
            equipmentTypeId: equipmentsTypesIds,
          },
          attributes: ["id"],
          raw: true,
        })
      ).map(raw => raw.id);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveOneEquipmentBrand(id: string): Promise<EquipmentBrand | null> {
    logger.info("retrieveOneEquipmentBrand");
    try {
      const result = await EquipmentBrand.findByPk(id);
      return result;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async deleteAllEquipmentsBrands(): Promise<void> {
    logger.info("deleteAllEquipmentsBrands");
    try {
      await EquipmentBrand.destroy({
        where: {},
        truncate: false,
      });
      return;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async deleteOneEquipmentBrand(id: string): Promise<void> {
    logger.info("deleteOneEquipmentBrand");
    try {
      await EquipmentBrand.destroy({
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
