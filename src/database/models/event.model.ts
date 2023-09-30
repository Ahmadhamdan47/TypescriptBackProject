import { Model, Sequelize, DataTypes } from "sequelize";

export class Event extends Model {
  declare id: number;
  declare timestamp: Date;
  declare equipmentProperty: string;
  declare equipmentName: string;
  declare stateName: string;
  declare systemName: string;
  declare params: string;

  static initModel(sequelize: Sequelize): void {
    Event.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        sequenceNumber: {
          type: DataTypes.INTEGER,
        },
        timestamp: {
          type: DataTypes.DATE,
        },
        equipmentProperty: {
          type: DataTypes.STRING,
        },
        equipmentName: {
          type: DataTypes.STRING,
        },
        stateName: {
          type: DataTypes.STRING,
        },
        systemName: {
          type: DataTypes.STRING,
        },
        params: {
          type: DataTypes.TEXT,
        },
      },
      {
        sequelize, // pass the database instance here
        tableName: "events", // here names can be pass in camel case for consistency
      }
    );
  }
}
