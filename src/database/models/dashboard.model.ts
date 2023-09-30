import { DashboardUser } from "./dashboardUser.model";
import { User } from "./user.model";
import { Sequelize, Model, DataTypes } from "sequelize";
export class Dashboard extends Model {
  [x: string]: any;
  declare id: number;
  declare name: string;
  declare description: string;
  declare layout: string;
  declare widgets: string;
  static initModel(sequelize: Sequelize): void {
    Dashboard.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        // Model attributes are defined here
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.STRING,
        },
        layout: {
          type: DataTypes.TEXT,
        },
        widgets: {
          type: DataTypes.TEXT,
        },
      },
      {
        sequelize, // pass the database instance here
        tableName: "dashboards", // here names can be pass in camel case for consistency
      }
    );
  }
  static associateModel(): void {
    Dashboard.belongsToMany(User, { through: DashboardUser });
  }
}
