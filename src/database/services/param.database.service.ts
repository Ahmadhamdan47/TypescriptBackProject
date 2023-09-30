import { Server } from "http";
import { logger } from "../../../logger";
import { NewParam } from "../interfaces/param.database";
import { Param } from "../models/param.model";

export class ParamDatabaseService {
  constructor(protected server: Server) {}

  async createOneParam(newParam: NewParam): Promise<Param> {
    logger.info("createOneParam");
    try {
      return await Param.create(newParam);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async createParams(newParams: NewParam[]): Promise<Param[]> {
    logger.info("createParams");
    try {
      return await Param.bulkCreate(newParams);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveAllParams(): Promise<Param[] | null> {
    logger.info("retrieveAllParams");
    try {
      const result = await Param.findAll();
      return result;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveOneParam(id: string): Promise<Param | null> {
    logger.info("retrieveOneParam");
    try {
      const result = await Param.findByPk(id);
      return result;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async deleteParamsFromIds(data?: { ids: number[] }): Promise<void> {
    logger.info("deleteParamsFromIds");
    try {
      await Param.destroy({
        where: data?.ids ? { id: data.ids } : {},
      });
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }
}
