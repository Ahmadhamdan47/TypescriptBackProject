import { Server } from "http";
import { logger } from "../../../logger";
import {
  NewActionTypeParam,
  ActionTypeParamDatabaseInterface,
} from "../interfaces/actionTypeParam.database";
import { ActionTypeParam } from "../models/actionTypeParam.model";

export class ActionTypeParamDatabaseService {
  constructor(protected server: Server) {}

  async createActionsTypesParams(
    newActionsTypesParams: NewActionTypeParam[]
  ): Promise<ActionTypeParamDatabaseInterface[]> {
    logger.info("createActionsTypesParams");
    try {
      return await ActionTypeParam.bulkCreate(newActionsTypesParams);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveAllActionsTypesParams(
    actionTypeId: any,
    paramId: any
  ): Promise<ActionTypeParamDatabaseInterface[] | null> {
    logger.info("retrieveAllActionsTypesParams");
    try {
      let result = [];
      if (actionTypeId) {
        result = await ActionTypeParam.findAll({
          where: {
            ActionTypeId: actionTypeId,
          },
        });
      } else if (paramId) {
        result = await ActionTypeParam.findAll({
          where: {
            ParamId: paramId,
          },
        });
      } else {
        result = await ActionTypeParam.findAll();
      }
      return result;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveAllParamsIdsFromActionsTypesIds(
    actionsTypesIds: number[]
  ): Promise<number[]> {
    logger.info("retrieveAllParamsIdsFromActionsTypesIds");
    try {
      let result = [];
      result = await ActionTypeParam.findAll({
        attributes: ["ParamId"],
        raw: true,
        where: {
          ActionTypeId: actionsTypesIds,
        },
      });
      return result.map(raw => raw.ParamId);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }
}
