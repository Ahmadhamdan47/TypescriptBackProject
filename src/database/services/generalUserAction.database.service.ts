import { GeneralUserAction } from "../models/generalUserAction.model";
import { logger } from "../../../logger";
import { NewGeneralUserAction } from "../interfaces/generalUserAction.database";
import { Server } from "http";
import {
  PaginationQueryDatabaseInterface,
  PaginationSequelizeDatabaseInterface,
} from "../interfaces/pagination.database";
import { Op } from "sequelize";

export class GeneralUserActionDatabaseService {
  constructor(protected server: Server) {}

  async logGeneralUserAction(
    generalUserAction: NewGeneralUserAction
  ): Promise<GeneralUserAction> {
    logger.info("logGeneralUserAction");
    try {
      const userActionCreated = await GeneralUserAction.create(
        generalUserAction
      );
      return userActionCreated;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
  async retrieveGeneralUserActions(
    pagination: PaginationQueryDatabaseInterface
  ): Promise<
    GeneralUserAction[] | PaginationSequelizeDatabaseInterface | null
  > {
    logger.info("retrieveGeneralUserActions");
    try {
      let result:
        | GeneralUserAction[]
        | PaginationSequelizeDatabaseInterface
        | null = [];

      if (pagination.size) {
        result = await GeneralUserAction.findAndCountAll({
          offset: Number(pagination.offset),
          limit: Number(pagination.size),
        });
      } else {
        result = await GeneralUserAction.findAll();
      }
      return result;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }
  async retrieveGeneralUserActionsByFilter(
    filters: any,
    pagination: PaginationQueryDatabaseInterface
  ): Promise<
    GeneralUserAction[] | PaginationSequelizeDatabaseInterface | null
  > {
    logger.info("retrieveGeneralUserActionsByFilter");
    try {
      const conditions = [];

      // Apply filters
      if (filters.username) {
        conditions.push({ username: { [Op.like]: `%${filters.username}%` } });
      }
      // Add more filter conditions as needed

      let conditionWhere: any;
      if (pagination.size) {
        conditionWhere = {
          where: conditions,
          offset: Number(pagination.offset),
          limit: Number(pagination.size),
        };
        return await GeneralUserAction.findAndCountAll(conditionWhere);
      } else {
        conditionWhere = {
          where: conditions,
        };
        return await GeneralUserAction.findAll(conditionWhere);
      }
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }
  async deleteGeneralUserActions(olderThan: Date): Promise<void> {
    logger.info("deleteGeneralUserActions");
    try {
      await GeneralUserAction.destroy({
        where: {
          createdAt: {
            [Op.lt]: olderThan,
          },
        },
      });
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }
}
