import { Server } from "http";
import config from "../resources/config";
import { prefs, customAxios as axios } from "../../webServer";
import {
  BackupDatabaseObject,
  BackupFile,
} from "../interfaces/backupDatabaseObject.server";
import { RestoreDatabaseObject } from "../interfaces/restoreDatabaseObject.server";
import {
  BACKUP_LOCATIONS,
  BACKUP_TYPE,
  DB_NAMES,
} from "../resources/constants";
import {
  backupDatabase,
  getBackupsNamesSortByDate,
} from "../interfaces/database.server";
import fs from "fs";
import { logger } from "../../../logger";

/**
 * Manage backup/restore of XTVision DB
 */
export class DatabaseServerService {
  constructor(protected server: Server) {}

  /**
   * Backup DB XTVision
   * @param backupDb
   * @param type : BACKUP_TYPE.scheduled | BACKUP_TYPE.manual
   * @returns
   */
  async backupDatabase(
    backupDb: BackupDatabaseObject,
    type: string = BACKUP_TYPE.manual
  ) {
    return await backupDatabase(backupDb, type);
  }

  /**
   * Restore DB XtVision
   * @param restoreDb
   * @param type : BACKUP_TYPE.scheduled | BACKUP_TYPE.manual
   * @returns
   */
  async restoreDatabase(
    restoreDb: RestoreDatabaseObject,
    type: string = BACKUP_TYPE.manual
  ) {
    return axios.post(
      config.xtvision.databaseUrl + "/setup/restore/" + type,
      restoreDb,
      {
        headers: {
          Authorization: prefs.databaseAuth,
        },
      }
    );
  }

  /**
   * Get databases names
   * @returns DB_NAMES[node_env]
   */
  async getDatabasesNames() {
    logger.info("getDatabasesNames");
    const node_env = process.env.NODE_ENV;
    if (node_env) return DB_NAMES[node_env];
    throw new Error("NODE_ENV is not defined");
  }

  /**
   * Get backups names sorted by date, olders last
   * @param type : BACKUP_TYPE.scheduled | BACKUP_TYPE.manual
   * @returns
   */
  async getBackupsNamesSortByDate(type: string): Promise<BackupFile[]> {
    logger.info("getBackupsNamesSortByDate");
    return await getBackupsNamesSortByDate(type);
  }

  /**
   * Delete a file in backup folder
   * @param backupName
   * @param type  BACKUP_TYPE.scheduled | BACKUP_TYPE.manual
   * @returns
   */
  async deleteBackup(backupNames: string[], type: string = BACKUP_TYPE.manual) {
    logger.info("deleteBackup");
    backupNames.forEach(backupName => {
      fs.unlinkSync(BACKUP_LOCATIONS[type] + "/" + backupName);
    });
  }
}
