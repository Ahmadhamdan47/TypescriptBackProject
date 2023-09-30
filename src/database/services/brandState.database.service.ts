import { Server } from "http";
import { logger } from "../../../logger";
import { NewBrandState } from "../interfaces/brandState.database";
import { BrandState } from "../models/brandState.model";

export class BrandStateDatabaseService {
  constructor(protected server: Server) {}

  async createBrandsStates(
    newBrandsStates: NewBrandState[]
  ): Promise<BrandState[]> {
    logger.info("createBrandsStates");
    try {
      return await BrandState.bulkCreate(newBrandsStates);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveAllBrandsStates(
    brandId: any,
    stateId: any
  ): Promise<BrandState[] | null> {
    logger.info("retrieveAllBrandsStates");
    try {
      let result = [];
      if (brandId) {
        result = await BrandState.findAll({
          where: {
            EquipmentBrandId: brandId,
          },
        });
      } else if (stateId) {
        result = await BrandState.findAll({
          where: {
            StateId: stateId,
          },
        });
      } else {
        result = await BrandState.findAll();
      }
      return result;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveAllStatesIdsFromBrandsIds(
    brandsIds: number[]
  ): Promise<number[]> {
    logger.info("retrieveAllStatesIdsFromBrandsIds");
    try {
      let result = [];
      result = await BrandState.findAll({
        attributes: ["StateId"],
        raw: true,
        where: {
          EquipmentBrandId: brandsIds,
        },
      });
      return result.map(raw => raw.StateId);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }
}
