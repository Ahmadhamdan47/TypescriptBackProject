import { Server } from "http";
import { logger } from "../../../logger";
import {
  NewStateParam,
  StateParamDatabaseInterface,
} from "../interfaces/stateParam.database";
import { StateParam } from "../models/stateParam.model";

export class StateParamDatabaseService {
  constructor(protected server: Server) {}

  async createStatesParams(
    newStatesParams: NewStateParam[]
  ): Promise<StateParamDatabaseInterface[]> {
    logger.info("createStatesParams");
    try {
      return await StateParam.bulkCreate(newStatesParams);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveAllStatesParams(
    stateId: any,
    paramId: any
  ): Promise<StateParamDatabaseInterface[] | null> {
    logger.info("retrieveAllStatesParams");
    try {
      let result = [];
      if (stateId) {
        result = await StateParam.findAll({
          where: {
            StateId: stateId,
          },
        });
      } else if (paramId) {
        result = await StateParam.findAll({
          where: {
            ParamId: paramId,
          },
        });
      } else {
        result = await StateParam.findAll();
      }
      return result;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveAllParamsIdsFromStatesIds(
    statesIds: number[]
  ): Promise<number[]> {
    logger.info("retrieveAllParamsIdsFromStatesIds");
    try {
      let result = [];
      result = await StateParam.findAll({
        attributes: ["ParamId"],
        raw: true,
        where: {
          StateId: statesIds,
        },
      });
      return result.map(raw => raw.ParamId);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }
}
