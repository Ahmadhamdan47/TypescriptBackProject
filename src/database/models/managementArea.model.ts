import { Model, Sequelize, DataTypes } from "sequelize";
import { User } from "./user.model";
import { ManagementAreaUser } from "./managementAreaUser.model";

export class ManagementArea extends Model {
  declare id: number;
  declare name: string;
  declare description: string;

  static initModel(sequelize: Sequelize): void {
    ManagementArea.init(
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
      },
      {
        sequelize, // pass the database instance here
        tableName: "managementAreas", // here names can be pass in camel case for consistency
      }
    );
  }
  static associateModel(): void {
    ManagementArea.belongsToMany(User, { through: ManagementAreaUser });
  }
}
