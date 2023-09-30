import { Model, Sequelize, DataTypes } from "sequelize";
import { Feature } from "./feature.model";
import { User } from "./user.model";
import { RoleUser } from "./roleUser.model";
import { RoleFeature } from "./roleFeature.model";

export class Role extends Model {
  [x: string]: any;
  declare id: number;
  declare name: string;
  declare description: string;

  static initModel(sequelize: Sequelize): void {
    Role.init(
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
        tableName: "roles", // here names can be pass in camel case for consistency
      }
    );
  }

  static associateModel(): void {
    Role.belongsToMany(User, { through: RoleUser });
    Role.belongsToMany(Feature, { through: RoleFeature });
  }
}
