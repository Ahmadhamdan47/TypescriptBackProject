import { Model, Sequelize, DataTypes } from "sequelize";
import { Param } from "./param.model";
import { StateParam } from "./stateParam.model";
import { BehaviorState } from "./behaviorState.model";
import { CurrentEquipmentState } from "./currentEquipmentState.model";
import { EquipmentProperty } from "./equipmentProperty.model";
import { BrandState } from "./brandState.model";
import { EquipmentBrand } from "./equipmentBrand.model";

export class State extends Model {
  declare id: number;
  declare name: string;

  static initModel(sequelize: Sequelize): void {
    State.init(
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
      },
      {
        sequelize, // pass the database instance here
        tableName: "states", // here names can be pass in camel case for consistency
      }
    );
  }

  static associateModel(): void {
    State.belongsToMany(Param, {
      through: StateParam,
    });
    State.hasMany(BehaviorState, {
      foreignKey: "stateId",
      onDelete: "CASCADE",
    });
    State.belongsToMany(EquipmentBrand, {
      through: BrandState,
    });
    State.hasMany(CurrentEquipmentState, {
      foreignKey: "currentStateId",
    });
    // "No action" means we want foreign key but because of many cycles between the tables, we can't create regular foreign key with "cascade"
    State.belongsTo(EquipmentProperty, {
      foreignKey: "equipmentPropertyId",
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION",
    });
  }
}
