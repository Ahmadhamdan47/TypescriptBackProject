import { NewUser, UserDatabaseInterface } from "../interfaces/user.database";
import { User } from "../models/user.model";
import { Server } from "http";
import { Role } from "../models/role.model";
import { ManagementArea } from "../models/managementArea.model";
import { Op } from "sequelize";
import { logger } from "../../../logger";
import { NewDashboardUser } from "../interfaces/dashboardUser.database";
import { NewManagementAreaUser } from "../interfaces/managementAreaUser.database";
import { NewRoleUser } from "../interfaces/roleUser.database";
import { UserFilter } from "../../server/interfaces/usersFilter";
import { NewCategoryUser } from "../interfaces/categoryUser.database";
import { RoleUserDatabaseService } from "./roleUser.database.service";
import { ManagementAreaUserDatabaseService } from "./managementAreaUser.database.service";
import { DashboardUserDatabaseService } from "./dashboardUser.database.service";
import { Feature } from "../models/feature.model";

export class UserDatabaseService {
  constructor(protected server: Server) {}
  roleUserService = new RoleUserDatabaseService(this.server);
  managementAreaUserService = new ManagementAreaUserDatabaseService(
    this.server
  );
  dashboardUserService = new DashboardUserDatabaseService(this.server);
  // V2: categoryUserService = new CategoryUserDatabaseService(this.server);

  async createOneUser(newUser: NewUser): Promise<UserDatabaseInterface> {
    logger.info("createOneUser");
    try {
      const result = await User.create(newUser);

      const rolesUserIds = newUser.roleIds?.map(roleId => ({
        UserId: roleId,
        RoleId: result.id,
      }));
      if (rolesUserIds) {
        await this.addRoles(rolesUserIds);
      }

      const managementAreasUserIds = newUser.managementAreaIds?.map(
        managementAreaId => ({
          UserId: managementAreaId,
          ManagementAreaId: result.id,
        })
      );
      if (managementAreasUserIds) {
        await this.addManagementAreas(managementAreasUserIds);
      }

      const dashboardsUserIds = newUser.dashboardIds?.map(dashboardId => ({
        UserId: dashboardId,
        DashboardId: result.id,
      }));
      if (dashboardsUserIds) {
        await this.addDashboards(dashboardsUserIds);
      }

      return result;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async updateUser(id: string, newUser: NewUser): Promise<void> {
    logger.info("updateUser");
    try {
      await User.update(newUser, {
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

  async retrieveAllUsers(name: any): Promise<User[]> {
    logger.info("retrieveAllUsers");
    let result: User[];
    let condition: any;
    try {
      condition = name ? { name: { [Op.eq]: `${name}` } } : null;
      result = await User.findAll({
        where: condition,
        include: [
          {
            model: Role,
            attributes: ["name"],
            through: { attributes: [] },
            include: [
              {
                model: Feature,
                attributes: ["name"],
                through: { attributes: [] },
              },
            ],
          },
          {
            model: ManagementArea,
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

  async retrieveUsersByFilters(filters: UserFilter): Promise<User[]> {
    logger.info("retrieveUsersByFilters");
    try {
      const conditions = [];
      if (filters.name) {
        // Op.like means includes string
        conditions.push({ name: { [Op.like]: `%${filters.name}%` } });
      }
      const conditionsRoles = [];
      if (filters.roles) {
        conditionsRoles.push({ name: filters.roles });
      }
      return await User.findAll({
        where: conditions,
        include: [
          {
            model: Role,
            where: conditionsRoles,
            attributes: ["name"],
            through: { attributes: [] },
          },
          {
            model: ManagementArea,
            attributes: ["name"],
            through: { attributes: [] },
          },
        ],
      });
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveOneUser(id: string): Promise<User | null> {
    logger.info("retrieveOneUser");
    try {
      const result = await User.findByPk(id, {
        include: [
          {
            model: Role,
            attributes: ["name"],
            through: { attributes: [] },
          },
          {
            model: ManagementArea,
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

  async deleteAllUsers(): Promise<void> {
    logger.info("deleteAllUsers");
    try {
      await User.destroy({
        where: {},
        truncate: false,
      });
      return;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async deleteOneUser(id: string): Promise<void> {
    logger.info("deleteOneUser");
    try {
      await User.destroy({
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

  //link roles to User
  async addRoles(ids: NewRoleUser[]) {
    logger.info("addRoles");
    await this.roleUserService.createRolesUsers(ids);
  }

  // link dashboards to User
  async addDashboards(ids: NewDashboardUser[]) {
    logger.info("addDashboards");
    await this.dashboardUserService.createDashboardsUsers(ids);
  }

  //link management areas to User
  async addManagementAreas(ids: NewManagementAreaUser[]) {
    logger.info("addManagementAreas");
    await this.managementAreaUserService.createManagementAreasUsers(ids);
  }

  // link categories to User
  async addCategories(ids: NewCategoryUser[]) {
    logger.info("addCategories");
    // V2: await this.categoryUserService.createCategoriesUsers(ids);
  }
}
