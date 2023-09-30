import { Model, Sequelize, DataTypes } from "sequelize";
import { Role } from "./role.model";
import { RoleFeature } from "./roleFeature.model";

export class Feature extends Model {
  declare id: number;
  declare name: string;
  declare description: string;

  static initModel(sequelize: Sequelize): void {
    Feature.init(
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
        tableName: "features", // here names can be pass in camel case for consistency
      }
    );
  }
  static associateModel(): void {
    Feature.belongsToMany(Role, { through: RoleFeature });
  }
}
