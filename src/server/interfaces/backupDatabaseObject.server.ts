export interface BackupDatabaseObject {
  dbName: string;
  backupName: string;
  description: string;
}

export interface BackupFile {
  name: string;
  creationDate: Date;
  size: number;
}
