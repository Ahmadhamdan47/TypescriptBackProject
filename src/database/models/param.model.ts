import { Model, Sequelize, DataTypes } from "sequelize";
import { ActionType } from "./actionType.model";
import { ActionTypeParam } from "./actionTypeParam.model";
import { State } from "./state.model";
import { StateParam } from "./stateParam.model";

export class Param extends Model {
  declare id: number;
  declare nameId: string;
  declare labelFr: string;
  declare labelEn: string;
  declare kind: string;
  declare paramValues: string;

  static initModel(sequelize: Sequelize): void {
    Param.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        nameId: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        labelFr: {
          type: DataTypes.STRING,
        },
        labelEn: {
          type: DataTypes.STRING,
        },
        kind: {
          type: DataTypes.STRING,
        },
        paramValues: {
          type: DataTypes.TEXT,
        },
      },
      {
        sequelize, // pass the database instance here
        tableName: "params", // here names can be pass in camel case for consistency
      }
    );
  }

  static associateModel(): void {
    Param.belongsToMany(State, {
      through: StateParam,
    });
    Param.belongsToMany(ActionType, {
      through: ActionTypeParam,
    });
  }
}
