import { Model, Sequelize, DataTypes } from "sequelize";

/**
 * General parameters of the application
 */
export class ApplicationParameter extends Model {
  declare id: number;
  // This 2 values are used to encode passwords app
  declare counter: number;
  declare value: string;

  static initModel(sequelize: Sequelize): void {
    ApplicationParameter.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        counter: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        value: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize, // pass the database instance here
        tableName: "applicationParameters", // here names can be pass in camel case for consistency
      }
    );
  }
}
