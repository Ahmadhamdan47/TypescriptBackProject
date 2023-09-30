import { Model, Sequelize, DataTypes } from "sequelize";
import { Equipment } from "./equipment.model";
import { EquipmentNotifBindingKey } from "./equipmentNotifBindingKey.model";
import { System } from "./system.model";
import { NotifPredefinedMessage } from "./notifPredefinedMessage.model";
import { NotifPredefinedMessageNotifBindingKey } from "./notifPredefinedMessageNotifBindingKey.model";

export class NotifBindingKey extends Model {
  declare id: number;
  declare name: string;

  static initModel(sequelize: Sequelize): void {
    NotifBindingKey.init(
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
        defaultMessageTtl: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        sendingMode: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize, // pass the database instance here
        tableName: "notifBindingKeys", // here names can be pass in camel case for consistency
      }
    );
  }

  static associateModel(): void {
    NotifBindingKey.belongsToMany(Equipment, {
      through: EquipmentNotifBindingKey,
    });
    NotifBindingKey.belongsToMany(NotifPredefinedMessage, {
      through: NotifPredefinedMessageNotifBindingKey,
    });
    // "No action" means we want foreign key but because of many cycles between the tables, we can't create regular foreign key with "cascade"
    NotifBindingKey.belongsTo(System, {
      foreignKey: "systemId",
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION",
    });
  }
}
