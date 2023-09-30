import { Model, Sequelize, DataTypes } from "sequelize";

/**
 * Table auto created by Sequelize when using belongsTo and hasMany.
 * We decide to create it manually to easily access and to improve performance to this table with CRUD functions
 * For example : bulkinsert linked ids in this table instead of linked them one by one
 */
export class BehaviorBehaviorProperty extends Model {
  declare BehaviorId: number;
  declare BehaviorPropertyId: number;

  static initModel(sequelize: Sequelize): void {
    BehaviorBehaviorProperty.init(
      {
        BehaviorId: {
          type: DataTypes.INTEGER,
        },
        BehaviorPropertyId: {
          type: DataTypes.INTEGER,
        },
      },
      {
        sequelize, // pass the database instance here
        tableName: "behaviors_behaviorsProperties", // here names can be pass in camel case for consistency
      }
    );
  }
}
