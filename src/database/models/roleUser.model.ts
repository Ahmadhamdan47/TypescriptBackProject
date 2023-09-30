import { Model, Sequelize, DataTypes } from "sequelize";

/**
 * Table auto created by Sequelize when using belongsTo and hasMany.
 * We decide to create it manually to easily access and to improve performance to this table with CRUD functions
 * For example : bulkinsert linked ids in this table instead of linked them one by one
 */
export class RoleUser extends Model {
  declare UserId: number;
  declare RoleId: number;

  static initModel(sequelize: Sequelize): void {
    RoleUser.init(
      {
        UserId: {
          type: DataTypes.INTEGER,
        },
        RoleId: {
          type: DataTypes.INTEGER,
        },
      },
      {
        sequelize, // pass the database instance here
        tableName: "roles_users", // here names can be pass in camel case for consistency
      }
    );
  }
}
