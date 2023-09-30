import { SecurityUserAction } from "../models/securityUserAction.model";
import { logger } from "../../../logger";
import { NewSecurityUserAction } from "../interfaces/securityUserAction.database";
import { Server } from "http";
import {
  PaginationQueryDatabaseInterface,
  PaginationSequelizeDatabaseInterface,
} from "../interfaces/pagination.database";
import { Op } from "sequelize";

export class SecurityUserActionDatabaseService {
  constructor(protected server: Server) {}

  async logSecurityUserAction(
    securityUserAction: NewSecurityUserAction
  ): Promise<SecurityUserAction> {
    logger.info("logSecurityUserAction");
    try {
      const securityUserActionCreated = await SecurityUserAction.create(
        securityUserAction
      );
      return securityUserActionCreated;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
  async retrieveSecurityUserActions(
    pagination: PaginationQueryDatabaseInterface
  ): Promise<
    SecurityUserAction[] | PaginationSequelizeDatabaseInterface | null
  > {
    logger.info("retrieveSecurityUserActions");
    try {
      let result:
        | SecurityUserAction[]
        | PaginationSequelizeDatabaseInterface
        | null = [];

      if (pagination.size) {
        result = await SecurityUserAction.findAndCountAll({
          offset: Number(pagination.offset),
          limit: Number(pagination.size),
        });
      } else {
        result = await SecurityUserAction.findAll();
      }
      return result;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }
  async retrieveSecurityUserActionsByFilter(
    filters: any,
    pagination: PaginationQueryDatabaseInterface
  ): Promise<
    SecurityUserAction[] | PaginationSequelizeDatabaseInterface | null
  > {
    logger.info("retrieveSecurityUserActionsByFilter");
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
        return await SecurityUserAction.findAndCountAll(conditionWhere);
      } else {
        conditionWhere = {
          where: conditions,
        };
        return await SecurityUserAction.findAll(conditionWhere);
      }
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }
}
