import { Model, Sequelize, DataTypes } from "sequelize";
import { EquipmentType } from "./equipmentType.model";
import { EquipmentTypeEquipmentProperty } from "./equipmentTypeEquipmentProperty.model";
import { BehaviorProperty } from "./behaviorProperty.model";
import { CurrentEquipmentState } from "./currentEquipmentState.model";
import { State } from "./state.model";
import { ActionType } from "./actionType.model";

export class EquipmentProperty extends Model {
  declare id: number;
  declare name: string;

  static initModel(sequelize: Sequelize): void {
    EquipmentProperty.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize, // pass the database instance here
        tableName: "equipmentProperties", // here names can be pass in camel case for consistency
      }
    );
  }

  static associateModel(): void {
    EquipmentProperty.belongsToMany(EquipmentType, {
      through: EquipmentTypeEquipmentProperty,
    });
    EquipmentProperty.hasMany(BehaviorProperty, {
      foreignKey: "equipmentPropertyId",
      onDelete: "CASCADE",
    });
    EquipmentProperty.hasMany(CurrentEquipmentState, {
      foreignKey: "equipmentPropertyId",
    });
    // "No action" means we want foreign key but because of many cycles between the tables, we can't create regular foreign key with "cascade"
    EquipmentProperty.hasMany(State, {
      foreignKey: "equipmentPropertyId",
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION",
    });
    EquipmentProperty.hasMany(ActionType, {
      foreignKey: "equipmentPropertyId",
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION",
    });
  }
}
