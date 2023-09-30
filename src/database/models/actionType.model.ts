import { Model, Sequelize, DataTypes } from "sequelize";
import { EquipmentBrand } from "./equipmentBrand.model";
import { BrandActionType } from "./brandActionType.model";
import { EquipmentProperty } from "./equipmentProperty.model";
import { Param } from "./param.model";
import { ActionTypeParam } from "./actionTypeParam.model";

export class ActionType extends Model {
  declare id: number;
  declare name: string;

  static initModel(sequelize: Sequelize): void {
    ActionType.init(
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
        tableName: "actionTypes", // here names can be pass in camel case for consistency
      }
    );
  }

  static associateModel(): void {
    ActionType.belongsToMany(Param, {
      through: ActionTypeParam,
    });
    ActionType.belongsToMany(EquipmentBrand, {
      through: BrandActionType,
    });
    // "No action" means we want foreign key but because of many cycles between the tables, we can't create regular foreign key with "cascade"
    ActionType.belongsTo(EquipmentProperty, {
      foreignKey: "equipmentPropertyId",
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION",
    });
  }
}
