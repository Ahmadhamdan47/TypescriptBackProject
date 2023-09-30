import * as config from "../config/config.json";
import * as pck from "../../../package.json";
import { Server } from "http";
import msSql from "mssql";
import { logger } from "../../../logger";
import SequelizeConnection from "../config/sequelizeConnection";
import {
  BACKUP_EXTENSION,
  BEFORE_RESTORE_BACKUP_EXTENSION,
  BACKUP_LOCATIONS,
} from "../../server/resources/constants";
import { BackupDatabaseObject } from "../../server/interfaces/backupDatabaseObject.server";
import path from "path";

// TODO to adapt if database type changes (MSSQL here)
// KO with Sequelize, native code for backup and restore in MSSQL

// Dynamic configuration depending on env
const dbConfig = (config as any)[process.env.NODE_ENV!].databaseConfig;
const dbExploit = (config as any)[process.env.NODE_ENV!].databaseExploit;
const dbSystem = (config as any)[process.env.NODE_ENV!].databaseSystem;

const msSqlDbConfig = {
  server: dbConfig.host + "\\" + dbConfig.dialectOptions.options.instanceName,
  user: dbConfig.username,
  password: dbConfig.password,
  trustServerCertificate: true,
};

const msSqlDbExploit = {
  server: dbExploit.host + "\\" + dbExploit.dialectOptions.options.instanceName,
  user: dbExploit.username,
  password: dbExploit.password,
  trustServerCertificate: true,
};
const msSqlDbSystem = {
  server: dbSystem.host + "\\" + dbSystem.dialectOptions.options.instanceName,
  user: dbSystem.username,
  password: dbSystem.password,
  trustServerCertificate: true,
};

export class DatabaseService {
  constructor(protected server: Server) {}

  /**
   *
   * @param backupName
   * @param backupLocationType  BACKUP_TYPE.scheduled | BACKUP_TYPE.manual
   */
  async restore(backupName: string, backupLocationType: string) {
    logger.info("restore");
    try {
      backupName = path.parse(backupName).name;
      const dbName = (
        await msSql.query(
          `RESTORE FILELISTONLY FROM DISK = '${BACKUP_LOCATIONS[backupLocationType]}${backupName}${BACKUP_EXTENSION}'`
        )
      ).recordset[0].LogicalName;

      await this.mssqlConnect(dbName);
      await this.mssqlBackup(
        backupLocationType,
        {
          dbName,
          backupName,
          description: "backup before restore",
        },
        BEFORE_RESTORE_BACKUP_EXTENSION,
        ""
      );
      // Close all transactions before restore and allow one user only
      await msSql.query(
        `ALTER DATABASE [${dbName}] SET SINGLE_USER WITH ROLLBACK IMMEDIATE`
      );
      // Restore the database
      // FILE = 1 because there is only one file in the backup (default = 1)
      // STATS = 5 to display the progress of the restore (default = 10)

      await msSql.query(
        `RESTORE DATABASE [${dbName}] FROM DISK = '${BACKUP_LOCATIONS[backupLocationType]}${backupName}${BACKUP_EXTENSION}' WITH FILE = 1, REPLACE, STATS = 5`
      );
      // Allow multi users again
      await msSql.query(
        `ALTER DATABASE [${dbName}] SET MULTI_USER WITH ROLLBACK IMMEDIATE`
      );
      await SequelizeConnection.migrateDatabases();
    } catch (err) {
      logger.error("err: ", err);
      throw err;
    }
  }

  /**
   * Backup a db
   * @param backupDatabaseObject
   * @param backupLocationType BACKUP_TYPE.scheduled | BACKUP_TYPE.manual
   */
  async backup(
    backupDatabaseObject: BackupDatabaseObject,
    backupLocationType: string
  ) {
    logger.info("backup");
    try {
      const dbName = backupDatabaseObject.dbName;
      await this.mssqlConnect(dbName);
      await this.mssqlBackup(backupLocationType, backupDatabaseObject);
    } catch (err) {
      logger.error("err: ", err);
      throw err;
    }
  }

  /**
   * According to NODE_ENV, connect to the right db
   * @param dbName
   */
  async mssqlConnect(dbName: string) {
    logger.info("mssqlConnect");
    if (dbName === dbConfig.database) {
      await msSql.connect(msSqlDbConfig);
    } else if (dbName === dbExploit.database) {
      await msSql.connect(msSqlDbExploit);
      //TODO DDC: Refactor This Function
    } else if (dbName === dbSystem.database) {
      await msSql.connect(msSqlDbSystem);
    }
  }

  /**
   * Perform the mssql queries to backup a db
   * @param backupLocationType  BACKUP_TYPE.scheduled | BACKUP_TYPE.manual
   * @param backupDatabaseObject contains dbName, backupName and description
   * @param extension is either ".backup" or "_before_restore.backup"
   * @param version
   */
  async mssqlBackup(
    backupLocationType: string,
    backupDatabaseObject: BackupDatabaseObject,
    extension: string = BACKUP_EXTENSION,
    version: string = "_V" + pck.version
  ) {
    logger.info("mssqlBackup");
    const { dbName, backupName, description } = { ...backupDatabaseObject };

    // use master to avoid error "Cannot open backup device"
    await msSql.query(`USE [master]`);
    // Backup the database
    await msSql.query(
      `BACKUP DATABASE [${dbName}] TO DISK = 
      '${BACKUP_LOCATIONS[backupLocationType]}${backupName}${version}${extension}' WITH NOFORMAT, INIT, DESCRIPTION = '${description}'`
    );
  }
}
