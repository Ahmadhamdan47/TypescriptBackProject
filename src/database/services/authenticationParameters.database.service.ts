import { Server } from "http";
import { logger } from "../../../logger";
import { AuthenticationParameter } from "../models/authenticationParameters.model";

export class AuthenticationParametersDatabaseService {
  constructor(protected server: Server) {}

  async retrieveAllAuthenticationParameters(): Promise<AuthenticationParameter | null> {
    logger.info("retrieveAllAuthenticationParameters");
    try {
      // Only 1 line because each SQL column is a parameter attribute
      return await AuthenticationParameter.findOne();
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async updateAuthenticationParameters(attributesToUpdate: any): Promise<void> {
    logger.info("updateAuthenticationParameters");
    try {
      await AuthenticationParameter.update(attributesToUpdate, {
        where: {},
      });
      return;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }
}
