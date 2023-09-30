import { Model, Sequelize, DataTypes } from "sequelize";
import { XtvisionEquipmentConfig } from "./xtvisionEquipmentConfig.model";
import { CurrentEquipmentState } from "./currentEquipmentState.model";
import { Behavior } from "./behavior.model";
import { NotifBindingKey } from "./notifBindingKey.model";
import { EquipmentNotifBindingKey } from "./equipmentNotifBindingKey.model";
import { Domain } from "./domain.model";
import { EquipmentBrand } from "./equipmentBrand.model";

export class Equipment extends Model {
  declare id: number;
  declare gid: number;
  declare name: string;
  declare label: string;
  declare ipAddress: string;
  declare release: string;
  declare camera: string;
  declare status: string;
  declare canReceiveTextMessage: boolean;

  static initModel(sequelize: Sequelize): void {
    Equipment.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        gid: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        label: {
          type: DataTypes.STRING,
        },
        ipAddress: {
          type: DataTypes.STRING,
        },
        release: {
          type: DataTypes.STRING,
        },
        camera: {
          type: DataTypes.STRING,
        },
        status: {
          type: DataTypes.STRING,
        },
        canReceiveTextMessage: {
          type: DataTypes.BOOLEAN,
        },
      },
      {
        sequelize, // pass the database instance here
        tableName: "equipments", // here names can be pass in camel case for consistency
      }
    );
  }

  static associateModel(): void {
    Equipment.belongsTo(EquipmentBrand, {
      foreignKey: "equipmentBrandId",
      onDelete: "CASCADE",
    });
    // Don't need cascade here because if we delete a domain or an equipment, we don't want to cascade
    Equipment.belongsTo(Domain, {
      foreignKey: "domainId",
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION",
    });
    // "No action" means we want foreign key but because of many cycles between the tables, we can't create regular foreign key with "cascade"
    Equipment.belongsTo(Behavior, {
      foreignKey: "behaviorId",
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION",
    });
    Equipment.hasOne(XtvisionEquipmentConfig, {
      foreignKey: "equipmentId",
      onDelete: "CASCADE",
    });
    Equipment.hasOne(CurrentEquipmentState, {
      foreignKey: "equipmentId",
      onDelete: "CASCADE",
    });
    Equipment.belongsToMany(NotifBindingKey, {
      through: EquipmentNotifBindingKey,
    });
  }
}
