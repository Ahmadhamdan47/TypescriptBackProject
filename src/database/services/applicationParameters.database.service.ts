import { Server } from "http";
import { logger } from "../../../logger";
import { ApplicationParameter } from "../models/applicationParameters.model";

export class ApplicationParametersDatabaseService {
  constructor(protected server: Server) {}

  async retrieveAllApplicationParameters(): Promise<ApplicationParameter | null> {
    logger.info("retrieveAllApplicationParameters");
    try {
      // Only 1 line because each SQL column is a parameter attribute
      return await ApplicationParameter.findOne();
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async updateApplicationParameters(attributesToUpdate: any): Promise<void> {
    logger.info("updateApplicationParameters");
    try {
      await ApplicationParameter.update(attributesToUpdate, {
        where: {},
      });
      return;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }
}
