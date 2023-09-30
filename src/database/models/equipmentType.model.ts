import { Model, Sequelize, DataTypes } from "sequelize";
import { Behavior } from "./behavior.model";
import { System } from "./system.model";
import { EquipmentTypeEquipmentProperty } from "./equipmentTypeEquipmentProperty.model";
import { EquipmentProperty } from "./equipmentProperty.model";
import { EquipmentBrand } from "./equipmentBrand.model";

export class EquipmentType extends Model {
  declare id: number;
  declare name: string;

  static initModel(sequelize: Sequelize): void {
    EquipmentType.init(
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
        tableName: "equipmentTypes", // here names can be pass in camel case for consistency
      }
    );
  }

  static associateModel(): void {
    EquipmentType.belongsTo(System, {
      foreignKey: "systemId",
      onDelete: "CASCADE",
    });
    EquipmentType.hasMany(EquipmentBrand, {
      foreignKey: "equipmentTypeId",
      onDelete: "CASCADE",
    });
    EquipmentType.hasMany(Behavior, {
      foreignKey: "equipmentTypeId",
      onDelete: "CASCADE",
    });
    EquipmentType.belongsToMany(EquipmentProperty, {
      through: EquipmentTypeEquipmentProperty,
    });
  }
}
