import { Model, Sequelize, DataTypes } from "sequelize";

export class ScheduledJob extends Model {
  declare id: number;
  declare name: string;
  declare description: string;
  declare task: string;
  declare date: Date;
  declare cron: string;
  declare param1: number;
  declare active: boolean;

  static initModel(sequelize: Sequelize): void {
    ScheduledJob.init(
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
        description: {
          type: DataTypes.STRING,
        },
        task: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        date: {
          type: DataTypes.DATE,
        },
        cron: {
          type: DataTypes.STRING,
        },
        param1: {
          type: DataTypes.INTEGER,
        },
        active: {
          type: DataTypes.BOOLEAN,
        },
      },
      {
        sequelize, // pass the database instance here
        tableName: "scheduledJobs", // here names can be pass in camel case for consistency
      }
    );
  }
}
