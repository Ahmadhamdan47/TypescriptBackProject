import assert from "assert";
import fs from "fs";
import { customAxios as axios, WebServer } from "../../src/webServer";
import { newEvent } from "../data/events.data";
import { EventDatabaseInterface } from "../../src/database/interfaces/event.database";
import { WebServerTestOAuth2 } from "./webServerTestOAuth2";
import {
  BackupDatabaseObject,
  BackupFile,
} from "../../src/server/interfaces/backupDatabaseObject.server";
import { RestoreDatabaseObject } from "../../src/server/interfaces/restoreDatabaseObject.server";
import {
  DB_NAMES,
  BACKUP_LOCATIONS,
} from "../../src/server/resources/constants";
import { httPrefix } from "../../src/server/resources/config";
import { databaseHeader, header, initPrefsForTests } from "./utilities";

const url = `${httPrefix}:5001/databases`;
const urlDbEvents = `${httPrefix}:5001/database/events`;

describe("database", function () {
  initPrefsForTests();

  const webServer = new WebServer({ port: 5001 });
  const webServerTestOAuth2 = new WebServerTestOAuth2();
  before(async () => {
    await webServerTestOAuth2.start();
    await webServer.start();
  });
  after(async () => {
    await webServer.stop();
    await webServerTestOAuth2.stop();
  });

  it("should backup and restore a database", async () => {
    // Clear events
    await axios.delete(urlDbEvents, databaseHeader);
    // Add events
    await axios.post(urlDbEvents, newEvent, databaseHeader);
    let nbEvents = (
      (await axios.get(urlDbEvents, databaseHeader))
        .data as EventDatabaseInterface[]
    ).length;
    assert(nbEvents !== 0);

    // Backup database
    const backupDatabaseObject: BackupDatabaseObject = {
      dbName: DB_NAMES.test.db_name_exploit_test,
      backupName: "test",
      description: "test backup XtVisionExploitDb",
    };

    const responseBackup = await axios.post(
      url + "/backup",
      backupDatabaseObject,
      header
    );
    assert(responseBackup.status === 200);
    // Database updated
    await axios.delete(urlDbEvents, databaseHeader);
    nbEvents = (
      (await axios.get(urlDbEvents, databaseHeader))
        .data as EventDatabaseInterface[]
    ).length;
    assert(nbEvents === 0);

    // Get backup files
    const backupFiles: BackupFile[] = (
      await axios.get(url + "/backupNames/manual", header)
    ).data;

    // Restore old database
    const restoreDatabaseObject: RestoreDatabaseObject = {
      backupName: backupFiles[0].name,
    };
    const responseRestore = await axios.post(
      url + "/restore",
      restoreDatabaseObject,
      header
    );
    assert(responseRestore.status === 200);
    // Check old is restored
    nbEvents = (
      (await axios.get(urlDbEvents, databaseHeader))
        .data as EventDatabaseInterface[]
    ).length;
    assert(nbEvents !== 0);

    // Delete backup files
    const backupFiles2: BackupFile[] = (
      await axios.get(url + "/backupNames/manual", header)
    ).data;

    backupFiles2.forEach(file => {
      fs.unlinkSync(BACKUP_LOCATIONS.manual + file.name);
    });
  });
});
