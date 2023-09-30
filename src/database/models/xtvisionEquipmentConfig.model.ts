import { Model, Sequelize, DataTypes } from "sequelize";
import { Equipment } from "./equipment.model";

/**
 * This class/table is used to manage the XtVision specific config for the class/table Equipment of systems.
 */
export class XtvisionEquipmentConfig extends Model {
  declare equipmentId: number;
  declare isSupervised: boolean;

  static initModel(sequelize: Sequelize): void {
    XtvisionEquipmentConfig.init(
      {
        equipmentId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        isSupervised: {
          type: DataTypes.BOOLEAN,
        },
      },
      {
        sequelize, // pass the database instance here
        tableName: "xtvisionEquipmentConfigs", // here names can be pass in camel case for consistency
      }
    );
  }

  static associateModel(): void {
    XtvisionEquipmentConfig.belongsTo(Equipment, {
      foreignKey: "equipmentId",
      onDelete: "CASCADE",
    });
  }
}
