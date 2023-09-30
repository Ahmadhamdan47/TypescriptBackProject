import { Model, Sequelize, DataTypes } from "sequelize";

export class NotifHistorizedMessage extends Model {
  declare id: number;
  declare systemId: number;
  declare serverUuid: string;
  declare title: string;
  declare body: string;
  declare messageTtl: number; // seconds
  declare messageDelay: number; // seconds
  declare priority: string;
  declare sender: string;
  declare notifBindingKeysIds: string;
  declare notifBindingKeysNames: string;
  declare status: string;

  static initModel(sequelize: Sequelize): void {
    NotifHistorizedMessage.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        systemId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        serverUuid: {
          type: DataTypes.STRING,
          allowNull: false,
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
        notifBindingKeysIds: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        notifBindingKeysNames: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        status: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        sequelize, // pass the database instance here
        tableName: " notifHistorizedMessages", // here names can be pass in camel case for consistency
      }
    );
  }
}
