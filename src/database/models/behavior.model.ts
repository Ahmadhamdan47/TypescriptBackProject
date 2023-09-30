import { Sequelize, Model, DataTypes } from "sequelize";
import { BehaviorBehaviorProperty } from "./behaviorBehaviorProperty.model";
import { BehaviorProperty } from "./behaviorProperty.model";
import { Equipment } from "./equipment.model";
import { EquipmentType } from "./equipmentType.model";

export class Behavior extends Model {
  declare id: number;
  declare name: string;
  declare icon: string;
  // Each type equipment has a behavior by default. If the user creates new behaviors for a type equipment, he must choose its default behavior for each type equipment.
  declare isDefault: boolean;

  static initModel(sequelize: Sequelize): void {
    Behavior.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        icon: {
          type: DataTypes.STRING,
        },
        name: {
          type: DataTypes.STRING,
        },
        isDefault: {
          type: DataTypes.BOOLEAN,
        },
      },
      {
        sequelize, // pass the database instance here
        tableName: "behaviors", // here names can be pass in camel case for consistency
      }
    );
  }
  static associateModel(): void {
    Behavior.belongsTo(EquipmentType, {
      foreignKey: "equipmentTypeId",
      onDelete: "CASCADE",
    });
    // "No action" means we want foreign key but because of many cycles between the tables, we can't create regular foreign key with "cascade"
    Behavior.hasMany(Equipment, {
      foreignKey: "behaviorId",
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION",
    });
    Behavior.belongsToMany(BehaviorProperty, {
      through: BehaviorBehaviorProperty,
    });
  }
}
