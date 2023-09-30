import { Model, Sequelize, DataTypes } from "sequelize";

export class SecurityUserAction extends Model {
  declare id: number;
  declare actionType: string;
  declare actionObject: string;
  declare username: string;
  declare isSuccessful: boolean;
  declare description: string | null;
  declare param1: string | null;
  declare param2: string | null;

  static initModel(sequelize: Sequelize): void {
    SecurityUserAction.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        actionType: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        actionObject: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        username: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        isSuccessful: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
        description: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        param1: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        param2: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        sequelize, // pass the database instance here
        tableName: "securityUserActions",
      }
    );
  }
}
