import { Server } from "http";
import { logger } from "../../../logger";
import { NewDomain } from "../interfaces/domain.database";
import { Domain } from "../models/domain.model";

export class DomainDatabaseService {
  constructor(protected server: Server) {}

  async createOneDomain(newDomain: NewDomain): Promise<Domain> {
    logger.info("createOneDomain");
    try {
      return await Domain.create(newDomain);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async createDomains(newDomains: NewDomain[]): Promise<Domain[]> {
    logger.info("createDomains");
    try {
      return await Domain.bulkCreate(newDomains);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveAllDomains(systemId: any): Promise<Domain[] | null> {
    logger.info("retrieveAllDomains");
    try {
      let result = [];
      if (systemId) {
        result = await Domain.findAll({
          where: {
            systemId,
          },
        });
      } else {
        result = await Domain.findAll();
      }
      return result;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveOneDomain(id: string): Promise<Domain | null> {
    logger.info("retrieveOneDomain");
    try {
      const result = await Domain.findByPk(id);
      return result;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveOneDomainByDomainSystemIdAndSystemId(
    domainSystemId: any,
    systemId: any
  ): Promise<Domain | null> {
    logger.info("retrieveOneDomainByDomainSystemIdAndSystemId");
    try {
      return await Domain.findOne({ where: { domainSystemId, systemId } });
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async deleteAllDomains(): Promise<void> {
    logger.info("deleteAllDomains");
    try {
      await Domain.destroy({
        where: {},
        truncate: false,
      });
      return;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async deleteOneDomain(id: string): Promise<void> {
    logger.info("deleteOneDomain");
    try {
      await Domain.destroy({
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
