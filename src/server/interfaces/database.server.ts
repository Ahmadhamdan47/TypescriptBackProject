import config from "../resources/config";
import { prefs, customAxios as axios } from "../../webServer";
import {
  BackupDatabaseObject,
  BackupFile,
} from "./backupDatabaseObject.server";
import { BACKUP_LOCATIONS } from "../resources/constants";
import fs from "fs";

/**
 *
 * @param backupDb
 * @param type : BACKUP_TYPE.scheduled | BACKUP_TYPE.manual
 * @returns
 */
export async function backupDatabase(
  backupDb: BackupDatabaseObject,
  type: string
) {
  return axios.post(
    config.xtvision.databaseUrl + "/setup/backup/" + type,
    backupDb,
    {
      headers: {
        Authorization: prefs.databaseAuth,
      },
    }
  );
}

/**
 * Get backups names sorted by date
 * @param type : BACKUP_TYPE.scheduled | BACKUP_TYPE.manual
 * @returns BackupFile[] : name, creationDate, olders last
 */
export async function getBackupsNamesSortByDate(
  type: string
): Promise<BackupFile[]> {
  return fs
    .readdirSync(BACKUP_LOCATIONS[type])
    .map(name => ({
      name,
      creationDate: fs.statSync(BACKUP_LOCATIONS[type] + name).birthtime,
      size: fs.statSync(BACKUP_LOCATIONS[type] + name).size,
    }))
    .sort(
      (a: BackupFile, b: BackupFile) =>
        b.creationDate.getTime() - a.creationDate.getTime()
    );
}
