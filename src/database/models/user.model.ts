import { Model, Sequelize, DataTypes } from "sequelize";
import { Dashboard } from "./dashboard.model";
import { ManagementArea } from "./managementArea.model";
import { Role } from "./role.model";
import { DashboardUser } from "./dashboardUser.model";
import { RoleUser } from "./roleUser.model";
import { ManagementAreaUser } from "./managementAreaUser.model";

export class User extends Model {
  [x: string]: any;
  declare id: number;
  declare name: string;
  declare description: string;
  declare language: string;
  declare time_zone: string;

  static initModel(sequelize: Sequelize): void {
    User.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          unique: true,
          allowNull: false,
        },
        description: {
          type: DataTypes.STRING,
        },
        language: {
          type: DataTypes.STRING,
        },
        time_zone: {
          type: DataTypes.STRING,
        },
      },
      {
        sequelize, // pass the database instance here
        tableName: "users", // here names can be pass in camel case for consistency
      }
    );
  }
  static associateModel(): void {
    User.belongsToMany(Role, { through: RoleUser });
    User.belongsToMany(Dashboard, { through: DashboardUser });
    User.belongsToMany(ManagementArea, { through: ManagementAreaUser });
  }
}
