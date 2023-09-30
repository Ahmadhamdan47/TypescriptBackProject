import { Options, QueryInterface, Sequelize } from "sequelize";
import { logger } from "../../../logger";
import * as config from "./config.json";
import * as pck from "../../../package.json";
import msSql from "mssql";
import { MigrationDbConfig } from "../models/migrationDbConfig.model";
import { RELEASES } from "../../server/resources/constants";
import { MigrationDbExploit } from "../models/migrationDbExploit.model";
import {
  up_dbConfig_to_V1_0_0,
  up_dbExploit_to_V1_0_0,
  up_dbSystem_to_V1_0_0
} from "../migrationsDbConfig/migration_1_0_0";
import {
  up_dbConfig_to_V2_0_0,
  up_dbExploit_to_V2_0_0,
  up_dbSystem_to_V2_0_0,
  down_dbConfig_from_V2_0_0,
  down_dbExploit_from_V2_0_0,
  down_dbSystem_from_V2_0_0

} from "../migrationsDbConfig/migration_2_0_0";
import { MigrationDbSystem } from "../models/migrationDbSystem.model";

// Dynamic configuration depending on env
const dbConfigOptions = (config as any)[process.env.NODE_ENV!].databaseConfig;
const dbExploitOptions = (config as any)[process.env.NODE_ENV!].databaseExploit;
const dbSystemOptions = (config as any)[process.env.NODE_ENV!].databaseSystem;

// TODO to adapt if database type changes (MSSQL here)
// KO with Sequelize, native code to create database if not exists in MSSQL
const msSqlDbConfig = {
  server:
    dbConfigOptions.host +
    "\\" +
    dbConfigOptions.dialectOptions.options.instanceName,
  user: dbConfigOptions.username,
  password: dbConfigOptions.password,
  trustServerCertificate: true,
};
const msSqlDbExploit = {
  server:
    dbExploitOptions.host +
    "\\" +
    dbExploitOptions.dialectOptions.options.instanceName,
  user: dbExploitOptions.username,
  password: dbExploitOptions.password,
  trustServerCertificate: true,
};
const msSqlDbSystem = {
  server: dbSystemOptions.host + "\\" + dbSystemOptions.dialectOptions.options.instanceName,
  user: dbSystemOptions.username,
  password: dbSystemOptions.password,
  trustServerCertificate: true,
};

class SequelizeConnection {
  private static instance: Sequelize[] = [];
  private static sequelizeDbConfig: QueryInterface;
  private static sequelizeDbExploit: QueryInterface;
  private static sequelizeDbSystem: QueryInterface;

  static getInstance(): Sequelize[] {
    if (SequelizeConnection.instance.length !== 3) {
      const dbConfig = dbConfigOptions as Options;
      dbConfig.logging = false;
      SequelizeConnection.instance.push(new Sequelize(dbConfig));
      const dbExploit = dbExploitOptions as Options;
      dbExploit.logging = false;
      SequelizeConnection.instance.push(new Sequelize(dbExploit));
      const dbSystem = dbSystemOptions as Options;
      dbSystem.logging = false;
      SequelizeConnection.instance.push(new Sequelize(dbSystem));
    }
    return SequelizeConnection.instance;
  }

  static async connect(): Promise<Sequelize[]> {
    const sequelize = SequelizeConnection.getInstance();
    try {
      await this.createDatabaseConfigIfNotExist();
      await sequelize[0].authenticate();
      this.sequelizeDbConfig = sequelize[0].getQueryInterface();
      logger.info("Database Config connection authenticated successfully");
      await this.createDatabaseExploitIfNotExist();
      await sequelize[1].authenticate();
      this.sequelizeDbExploit = sequelize[1].getQueryInterface();
      logger.info("Database Exploit connection authenticated successfully");
      await this.createDatabaseSystemIfNotExist();
      await sequelize[2].authenticate();
      this.sequelizeDbSystem = sequelize[2].getQueryInterface();
      logger.info("Database System connection authenticated successfully");
      
      return sequelize;
    } catch (err) {
      logger.error("Error while creation connection to database : ", err);
      throw err;
    }
  }

  static async close(): Promise<Sequelize[]> {
    const sequelize = SequelizeConnection.getInstance();
    try {
      await sequelize[0].close();
      logger.info("Database Config connection closed successfully");
      await sequelize[1].close();
      logger.info("Database Exploit connection closed successfully");
      await sequelize[2].close();
      logger.info("Database System connection closed successfully");
      return sequelize;
    } catch (err) {
      logger.error("Error while closing database connection : ", err);
      throw err;
    }
  }

  static async createDatabaseConfigIfNotExist() {
    logger.info("createDatabaseConfigIfNotExist");
    await msSql.connect(msSqlDbConfig);
    await msSql.query(`IF NOT EXISTS(SELECT * FROM sys.databases WHERE name = '${dbConfigOptions.database}')
      BEGIN
        CREATE DATABASE [${dbConfigOptions.database}]
        END`);
  }

  static async createDatabaseExploitIfNotExist() {
    logger.info("createDatabaseExploitIfNotExist");
    await msSql.connect(msSqlDbExploit);
    await msSql.query(`IF NOT EXISTS(SELECT * FROM sys.databases WHERE name = '${dbExploitOptions.database}')
      BEGIN
        CREATE DATABASE [${dbExploitOptions.database}]
        END`);
  }

  static async createDatabaseSystemIfNotExist() {
    
    await msSql.connect(msSqlDbSystem);
    await msSql.query(`IF NOT EXISTS(SELECT * FROM sys.databases WHERE name = '${dbSystemOptions.database}')
      BEGIN
        CREATE DATABASE [${dbSystemOptions.database}]
        END`);
  }

  static async migrateDatabases() {
    logger.info("migrateDatabases");
    // Version xtvision (format: X.X.X)
    // found in package.json
    const xtvisionVersion = pck.version?.split(".");
    // Version xtvision (format: 000000)
    const xtvisionVersionInt =
      +xtvisionVersion![0] * 10000 +
      +xtvisionVersion![1] * 100 +
      +xtvisionVersion![2];

    // Get all migrations already done
    // Config db
    const migrationsConfig = (await MigrationDbConfig.findAll()).map(
      raw => raw.releaseId
    );
    const lastMigrationConfig = Math.max(...migrationsConfig, 0);
    // Exploit db
    const migrationsExploit = (await MigrationDbExploit.findAll()).map(
      raw => raw.releaseId
    );
    const lastMigrationExploit = Math.max(...migrationsExploit, 0);
    //System db
    const migrationsSystem = (await MigrationDbSystem.findAll()).map(
      raw => raw.releaseId
    );
    const lastMigrationsSystem = Math.max(...migrationsSystem, 0);

    // Each "if" condition is only applied once (Migrations table auto created to keep track)
    if (
      lastMigrationConfig < xtvisionVersionInt ||
      lastMigrationExploit < xtvisionVersionInt ||
      lastMigrationsSystem < xtvisionVersionInt
      
    ) {
      await this.migrateUpDatabases(
        xtvisionVersionInt,
        migrationsConfig,
        migrationsExploit,
        migrationsSystem
      );
    } else if (
      lastMigrationConfig > xtvisionVersionInt ||
      lastMigrationExploit > xtvisionVersionInt
    ) {
      await this.migrateDownDatabases(
        xtvisionVersionInt,
        migrationsConfig,
        migrationsExploit,
        migrationsSystem
      );
    }
  }

  static async migrateUpDatabases(
    xtvisionVersionInt: number,
    migrationsConfig: number[],
    migrationsExploit: number[],
    migrationsSystem: number[]
  ) {
    logger.info("migrateUpDatabases");
    try {
      // Iterate over all releases to migrate up until current version
      for (const [key, value] of Object.entries(RELEASES).slice(
        0,
        Object.values(RELEASES).indexOf(xtvisionVersionInt) + 1
      )) {
        if (!migrationsConfig.includes(value)) {
          await this.upMigrationCaller(
            "up_dbConfig_to_",
            key,
            this.sequelizeDbConfig,
            MigrationDbConfig
          );
        }
        if (!migrationsExploit.includes(value)) {
          await this.upMigrationCaller(
            "up_dbExploit_to_",
            key,
            this.sequelizeDbExploit,
            MigrationDbExploit
          );
        }
        if (!migrationsSystem.includes(value)) {
          await this.upMigrationCaller(
            "up_dbSystem_to_",
            key,
            this.sequelizeDbSystem,
            MigrationDbSystem
          );
        }
      }
    } catch (error) {
      logger.error(error);
    }
  }

  static async migrateDownDatabases(
    xtvisionVersionInt: number,
    migrationsConfig: number[],
    migrationsExploit: number[],
    migrationsSystem: number[]
  ) {
    logger.info("migrateDownDatabases");
    try {
      // Iterate over all releases in reverse order to migrate down until current version
      for (const [key, value] of Object.entries(RELEASES)
        .slice(Object.values(RELEASES).indexOf(xtvisionVersionInt) + 1)
        .reverse()) {
        if (migrationsConfig.includes(value)) {
          await this.downMigrationCaller(
            "down_dbConfig_from_",
            key,
            this.sequelizeDbConfig,
            MigrationDbConfig
          );
        }
        if (migrationsExploit.includes(value)) {
          await this.downMigrationCaller(
            "down_dbExploit_from_",
            key,
            this.sequelizeDbExploit,
            MigrationDbExploit
          );       
        }
        if (migrationsSystem.includes(value)) {
          await this.downMigrationCaller(
            "down_dbSystem_from_",
            key,
            this.sequelizeDbSystem,
            MigrationDbSystem
          );
        }
      }
    } catch (error) {
      logger.error(error);
    }
  }

  static upMigrationDict: {
    [K: string]: (queryInterface: QueryInterface) => Promise<void>;
  } = {
    up_dbConfig_to_V1_0_0: up_dbConfig_to_V1_0_0,
    up_dbConfig_to_V2_0_0: up_dbConfig_to_V2_0_0,
    up_dbExploit_to_V1_0_0: up_dbExploit_to_V1_0_0,
    up_dbExploit_to_V2_0_0: up_dbExploit_to_V2_0_0,
    up_dbSystem_to_V1_0_0: up_dbSystem_to_V1_0_0,
    up_dbSystem_to_V2_0_0: up_dbSystem_to_V2_0_0,
  };

  static downMigrationDict: {
    [K: string]: (queryInterface: QueryInterface) => Promise<void>;
  } = {
    down_dbConfig_from_V2_0_0: down_dbConfig_from_V2_0_0,
    down_dbExploit_from_V2_0_0: down_dbExploit_from_V2_0_0,
    down_dbSystem_from_V2_0_0: down_dbSystem_from_V2_0_0,
    
  };

  /**
   * Call the up migration function, composed of the name and the version
   * @param name beggining of the function name
   * @param version end of the function name
   * @param queryInterface needs to be passed as the dictionary "this" is not the same as the class's
   * @param migrationDb MigrationDbConfig or MigrationDbExploit, can't give a type because a union type is not accepted.
   * It's the migration table used to keep track of the migrations
   * @returns
   */
  static async upMigrationCaller(
    name: string,
    version: string,
    queryInterface: QueryInterface,
    migrationDb: any
  ) {
    logger.info("upMigrationCaller");
    const functionName = name + version;
    try {
      if (this.upMigrationDict[functionName]) {
        await this.upMigrationDict[functionName](queryInterface);
        await migrationDb.create({
          releaseId: RELEASES[version],
          // replace all underscores with dots and remove "V": V1_0_0 -> 1.0.0
          release: version.replace(/_/g, ".").replace("V", ""),
        });
        return;
      }
    } catch (error) {
      logger.error("Error on migration " + functionName + " : " + error);
      throw error;
    }
    throw new Error(`Method '${functionName}' is not implemented.`);
  }

  static async downMigrationCaller(
    name: string,
    version: string,
    queryInterface: QueryInterface,
    migrationDb: any
  ) {
    logger.info("downMigrationCaller");
    const functionName = name + version;
    try {
      if (this.downMigrationDict[functionName]) {
        await this.downMigrationDict[functionName](queryInterface);
        await migrationDb.destroy({
          where: {
            releaseId: RELEASES[version],
          },
        });
        return;
      }
    } catch (error) {
      logger.error("Error on migration " + functionName + " : " + error);
      throw error;
    }
    throw new Error(`Method '${functionName}' is not implemented.`);
  }
  // Important note: The migrations are not executed in the order they are defined
  // in the dictionaries but in the order they are defined in the RELEASES constant.
}

export default SequelizeConnection;
