import { Model, Sequelize, DataTypes } from "sequelize";
import { Equipment } from "./equipment.model";
import { State } from "./state.model";
import { EquipmentProperty } from "./equipmentProperty.model";

export class CurrentEquipmentState extends Model {
  declare equipmentId: number;

  static initModel(sequelize: Sequelize): void {
    CurrentEquipmentState.init(
      {
        equipmentId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize, // pass the database instance here
        tableName: "currentEquipmentStates", // here names can be pass in camel case for consistency
      }
    );
  }

  static associateModel(): void {
    CurrentEquipmentState.belongsTo(Equipment, {
      foreignKey: "equipmentId",
      onDelete: "CASCADE",
    });
    CurrentEquipmentState.belongsTo(EquipmentProperty, {
      foreignKey: "equipmentPropertyId",
    });
    CurrentEquipmentState.belongsTo(State, {
      foreignKey: "currentStateId",
    });
  }
}
