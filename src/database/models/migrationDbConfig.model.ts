import { Model, Sequelize, DataTypes } from "sequelize";

export class MigrationDbConfig extends Model {
  declare releaseId: number;

  static initModel(sequelize: Sequelize): void {
    MigrationDbConfig.init(
      {
        releaseId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        release: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize, // pass the database instance here
        tableName: "migrations", // here names can be pass in camel case for consistency
      }
    );
  }
}
