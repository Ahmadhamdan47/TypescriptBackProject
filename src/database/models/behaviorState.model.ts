import { Sequelize, Model, DataTypes } from "sequelize";
import { BehaviorProperty } from "./behaviorProperty.model";
import { State } from "./state.model";
export class BehaviorState extends Model {
  declare id: number;
  declare name: string;
  declare icon: string;
  declare isAlarm: boolean;
  declare isFault: boolean;
  declare mustBeArchived: boolean;

  static initModel(sequelize: Sequelize): void {
    BehaviorState.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
        },
        icon: {
          type: DataTypes.STRING,
        },
        isAlarm: {
          type: DataTypes.BOOLEAN,
        },
        isFault: {
          type: DataTypes.BOOLEAN,
        },
        mustBeArchived: {
          type: DataTypes.BOOLEAN,
        },
      },
      {
        sequelize, // pass the database instance here
        tableName: "behaviorStates", // here names can be pass in camel case for consistency
      }
    );
  }
  static associateModel(): void {
    BehaviorState.belongsTo(BehaviorProperty, {
      foreignKey: "behaviorPropertyId",
      onDelete: "CASCADE",
    });
    BehaviorState.belongsTo(State, {
      foreignKey: "stateId",
      onDelete: "CASCADE",
    });
  }
}
