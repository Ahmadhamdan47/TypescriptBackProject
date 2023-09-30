import { Model, Sequelize, DataTypes } from "sequelize";
import { NotifBindingKey } from "./notifBindingKey.model";
import { NotifPredefinedMessageNotifBindingKey } from "./notifPredefinedMessageNotifBindingKey.model";

export class NotifPredefinedMessage extends Model {
  declare id: number;
  declare title: string;
  declare body: string;
  declare messageTtl: number; // seconds
  declare messageDelay: number; // seconds
  declare priority: string;
  declare sender: string;

  static initModel(sequelize: Sequelize): void {
    NotifPredefinedMessage.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        body: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        messageTtl: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        messageDelay: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        priority: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        sender: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize, // pass the database instance here
        tableName: "notifPredefinedMessages", // here names can be pass in camel case for consistency
      }
    );
  }

  static associateModel(): void {
    NotifPredefinedMessage.belongsToMany(NotifBindingKey, {
      through: NotifPredefinedMessageNotifBindingKey,
    });
  }
}
