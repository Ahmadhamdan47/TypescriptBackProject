import {
  ManagementAreaDatabaseInterface,
  NewManagementArea,
} from "../interfaces/managementArea.database";
import { ManagementArea } from "../models/managementArea.model";
import { Server } from "http";
import { Op } from "sequelize";
import { User } from "../models/user.model";
import { logger } from "../../../logger";
import { NewManagementAreaUser } from "../interfaces/managementAreaUser.database";
import { ManagementAreaUserDatabaseService } from "./managementAreaUser.database.service";

export class ManagementAreaDatabaseService {
  constructor(protected server: Server) {}
  managementAreaUserService = new ManagementAreaUserDatabaseService(
    this.server
  );

  async createOneManagementArea(
    newManagementArea: NewManagementArea
  ): Promise<ManagementAreaDatabaseInterface> {
    logger.info("createOneManagementArea");
    try {
      const result = await ManagementArea.create(newManagementArea);
      const managementAreasUserIds = newManagementArea.userIds?.map(userId => ({
        UserId: userId,
        ManagementAreaId: result.id,
      }));
      if (managementAreasUserIds) {
        await this.addUsers(managementAreasUserIds);
      }
      return result;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async updateManagementArea(
    id: string,
    newManagementArea: NewManagementArea
  ): Promise<void> {
    logger.info("updateManagementArea");
    try {
      await ManagementArea.update(newManagementArea, {
        where: {
          id,
        },
      });
      return;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveAllManagementAreas(
    name: any,
    username: any
  ): Promise<ManagementArea[]> {
    logger.info("retrieveAllManagementAreas");
    let result: ManagementArea[];
    let condition: any;
    let conditionUsername: any;
    try {
      condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
      conditionUsername = username
        ? { name: { [Op.eq]: `${username}` } }
        : null;
      result = await ManagementArea.findAll({
        where: condition,
        include: [
          {
            model: User,
            where: conditionUsername,
            attributes: ["name"],
            through: { attributes: [] },
          },
        ],
      });
      return result;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveOneManagementArea(id: string): Promise<ManagementArea | null> {
    logger.info("retrieveOneManagementArea");
    try {
      const result = await ManagementArea.findByPk(id);
      return result;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async deleteAllManagementAreas(): Promise<void> {
    logger.info("deleteAllManagementAreas");
    try {
      await ManagementArea.destroy({
        where: {},
        truncate: false,
      });
      return;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async deleteOneManagementArea(id: string): Promise<void> {
    logger.info("deleteOneManagementArea");
    try {
      await ManagementArea.destroy({
        where: {
          id,
        },
      });
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  /*----------------------------------------------
  |  LINKS
  ------------------------------------------------*/

  // link users to Role
  async addUsers(ids: NewManagementAreaUser[]) {
    logger.info("addUsers");
    await this.managementAreaUserService.createManagementAreasUsers(ids);
  }
}
