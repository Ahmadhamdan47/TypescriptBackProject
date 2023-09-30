import { Model, Sequelize, DataTypes } from "sequelize";
import { BrandState } from "./brandState.model";
import { BrandActionType } from "./brandActionType.model";
import { Equipment } from "./equipment.model";
import { State } from "./state.model";
import { ActionType } from "./actionType.model";
import { EquipmentType } from "./equipmentType.model";

export class EquipmentBrand extends Model {
  declare id: number;
  declare name: string;

  static initModel(sequelize: Sequelize): void {
    EquipmentBrand.init(
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
        tableName: "equipmentBrands", // here names can be pass in camel case for consistency
      }
    );
  }

  static associateModel(): void {
    EquipmentBrand.belongsTo(EquipmentType, {
      foreignKey: "equipmentTypeId",
      onDelete: "CASCADE",
    });
    EquipmentBrand.hasMany(Equipment, {
      foreignKey: "equipmentBrandId",
      onDelete: "CASCADE",
    });
    EquipmentBrand.belongsToMany(State, {
      through: BrandState,
    });
    EquipmentBrand.belongsToMany(ActionType, {
      through: BrandActionType,
    });
  }
}
