import { Sequelize, Model, DataTypes } from "sequelize";
import { Behavior } from "./behavior.model";
import { BehaviorBehaviorProperty } from "./behaviorBehaviorProperty.model";
import { BehaviorState } from "./behaviorState.model";
import { EquipmentProperty } from "./equipmentProperty.model";
export class BehaviorProperty extends Model {
  declare id: number;
  declare name: string;

  static initModel(sequelize: Sequelize): void {
    BehaviorProperty.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
        },
      },
      {
        sequelize, // pass the database instance here
        tableName: "behaviorProperties", // here names can be pass in camel case for consistency
      }
    );
  }
  static associateModel(): void {
    BehaviorProperty.hasMany(BehaviorState, {
      foreignKey: "behaviorPropertyId",
      onDelete: "CASCADE",
    });
    BehaviorProperty.belongsToMany(Behavior, {
      through: BehaviorBehaviorProperty,
    });
    BehaviorProperty.belongsTo(EquipmentProperty, {
      foreignKey: "equipmentPropertyId",
      onDelete: "CASCADE",
    });
  }
}
