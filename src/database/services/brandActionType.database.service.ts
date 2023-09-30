import { Server } from "http";
import { logger } from "../../../logger";
import { NewBrandActionType } from "../interfaces/brandActionType.database";
import { BrandActionType } from "../models/brandActionType.model";

export class BrandActionTypeDatabaseService {
  constructor(protected server: Server) {}

  async createBrandsActionsTypes(
    newBrandsActionsTypes: NewBrandActionType[]
  ): Promise<BrandActionType[]> {
    logger.info("createBrandsActionsTypes");
    try {
      return await BrandActionType.bulkCreate(newBrandsActionsTypes);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveAllBrandsActionsTypes(
    brandId: any,
    actionTypeId: any
  ): Promise<BrandActionType[] | null> {
    logger.info("retrieveAllBrandsActionsTypes");
    try {
      let result = [];
      if (brandId) {
        result = await BrandActionType.findAll({
          where: {
            EquipmentBrandId: brandId,
          },
        });
      } else if (actionTypeId) {
        result = await BrandActionType.findAll({
          where: {
            ActionTypeId: actionTypeId,
          },
        });
      } else {
        result = await BrandActionType.findAll();
      }
      return result;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveAllActionsTypesIdsFromBrandsIds(
    brandsIds: number[]
  ): Promise<number[]> {
    logger.info("retrieveAllActionsTypesIdsFromBrandsIds");
    try {
      let result = [];
      result = await BrandActionType.findAll({
        attributes: ["ActionTypeId"],
        raw: true,
        where: {
          EquipmentBrandId: brandsIds,
        },
      });
      return result.map(raw => raw.ActionTypeId);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }
}
