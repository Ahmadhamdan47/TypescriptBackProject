import { Model, Sequelize, DataTypes } from "sequelize";
import { Domain } from "./domain.model";
import { NotifBindingKey } from "./notifBindingKey.model";
import { EquipmentType } from "./equipmentType.model";

export class System extends Model {
  declare id: number;
  declare name: string;
  declare kind: string;
  declare brand: string;
  declare port: string;
  declare address: string;
  declare url_connexion_api: string;
  declare url_connexion_ws: string;
  declare release: string;
  declare state: string;
  declare createdBy: string;
  declare updatedBy: string;
  declare authMode: string;
  declare user: string;
  declare password: string;

  static initModel(sequelize: Sequelize): void {
    System.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        kind: {
          type: DataTypes.STRING,
        },
        brand: {
          type: DataTypes.STRING,
        },
        port: {
          type: DataTypes.STRING,
        },
        address: {
          type: DataTypes.STRING,
        },
        url_connexion_api: {
          type: DataTypes.STRING,
        },
        url_connexion_ws: {
          type: DataTypes.STRING,
        },
        release: {
          type: DataTypes.STRING,
        },
        state: {
          type: DataTypes.STRING,
        },
        createdBy: {
          type: DataTypes.STRING,
        },
        updatedBy: {
          type: DataTypes.STRING,
        },
        authMode: {
          type: DataTypes.STRING,
        },
        user: {
          type: DataTypes.STRING,
        },
        password: {
          type: DataTypes.STRING,
        },
      },
      {
        sequelize, // pass the database instance here
        tableName: "systems", // here names can be pass in camel case for consistency
      }
    );
  }

  static associateModel(): void {
    System.hasMany(EquipmentType, {
      foreignKey: "systemId",
      onDelete: "CASCADE",
    });
    System.hasMany(Domain, {
      foreignKey: "systemId",
      onDelete: "CASCADE",
    });
    System.hasMany(NotifBindingKey, {
      foreignKey: "systemId",
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION",
    });
    // TODO link in database managementArea and category for a system
  }
}
