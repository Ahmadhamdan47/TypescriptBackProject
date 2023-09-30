import { Model, Sequelize, DataTypes } from "sequelize";
import { Equipment } from "./equipment.model";
import { System } from "./system.model";

export class Domain extends Model {
  declare id: number;
  declare name: string;
  // Attribute "id" replicated from the table "domain" of the system (we need it in case of multiple systems with same domains ids)
  declare domainSystemId: number;
  // Attribute "parentId" replicated from the table "domain" of the system
  declare parentDomainSystemId: number;

  static initModel(sequelize: Sequelize): void {
    Domain.init(
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
        domainSystemId: {
          type: DataTypes.INTEGER,
        },
        parentDomainSystemId: {
          type: DataTypes.INTEGER,
        },
      },
      {
        sequelize, // pass the database instance here
        tableName: "domains", // here names can be pass in camel case for consistency
      }
    );
  }

  static associateModel(): void {
    Domain.belongsTo(System, {
      foreignKey: "systemId",
      onDelete: "CASCADE",
    });
    // Don't need cascade here because if we delete a domain or an equipment, we don't want to cascade
    Domain.hasMany(Equipment, {
      foreignKey: "domainId",
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION",
    });
  }
}
