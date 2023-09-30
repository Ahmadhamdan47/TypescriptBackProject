import config from "../resources/config";
import { prefs, customAxios as axios } from "../../webServer";
import nodeSchedule from "node-schedule";
import {
  NotifMessageServerInterface,
  sendNotifMessage,
} from "../interfaces/notifMessage.server";
import { NotifHistorizedMessage } from "../../database/models/notifHistorizedMessage.model";
import { logger } from "../../../logger";
import {
  DB_NAMES,
  BACKUP_LOCATIONS,
  BACKUP_TYPE,
  NODE_ENV_TEST,
} from "../resources/constants";
import { BackupDatabaseObject } from "../interfaces/backupDatabaseObject.server";
import fs from "fs";
import {
  backupDatabase,
  getBackupsNamesSortByDate,
} from "../interfaces/database.server";
import { Request } from "express";
import { purgedays } from "../../database/migrationsDbConfig/migration_1_0_0";

const urlScheduledJobs = config.xtvision.databaseUrl + "/scheduledJobs";
const urlHistorizedMessages =
  config.xtvision.databaseUrl + "/notifHistorizedMessages";

const urlGeneralUserActions =
  config.xtvision.databaseUrl + "/generalUserActions";

/**
 * Schedule jobs from database
 * @returns
 */
export async function scheduleDatabaseJobs() {
  logger.info("scheduleDatabaseJobs");
  // create backup directories if they don't exist
  Object.values(BACKUP_LOCATIONS).forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  // get all scheduled jobs from database
  const scheduledJobs = (
    await axios.get(urlScheduledJobs, {
      headers: {
        Authorization: prefs.databaseAuth,
      },
    })
  ).data;

  //   iterate over scheduledJobs and schedule them
  for await (const job of scheduledJobs) {
    // periodic job, can be active or not
    if (job.cron && job.active) {
      try {
        nodeSchedule.scheduleJob(job.id.toString(), job.cron, async () => {
          ScheduledJobsNames[job.task](job.id, job.param1);
        });
      } catch (error) {
        logger.error(error);
      }
    }
    // single time job, can't have an active status
    else if (job.date) {
      try {
        nodeSchedule.scheduleJob(job.id.toString(), job.date, async () => {
          ScheduledJobsNames[job.task](job.id, job.param1);
        });
      } catch (error) {
        logger.error(error);
      }
    }
  }
}

export enum EnumScheduledJobsNames {
  sendScheduledMessage = "sendScheduledMessage",
  backupDatabases = "backupDatabases",
  purgeOldUserActions = "purgeOldUserActions",
}

export const ScheduledJobsNames: {
  [K: string]: (...params: any) => Promise<void>;
} = {
  sendScheduledMessage: sendScheduledMessage,
  backupDatabases: backupDatabases,
  purgeOldUserActions: purgeOldUserActions,
};

/**
 * Send scheduled message
 * @param scheduledJobId
 * @param param1
 */
export async function sendScheduledMessage(
  scheduledJobId: number,
  param1: number
): Promise<void> {
  logger.info("sendScheduledMessage");
  const historizedMessage: NotifHistorizedMessage = (
    await axios.get(urlHistorizedMessages + "/" + param1, {
      headers: {
        Authorization: prefs.databaseAuth,
      },
    })
  ).data;

  const message: NotifMessageServerInterface = {
    title: historizedMessage.title,
    body: historizedMessage.body,
    messageTtl: historizedMessage.messageTtl,
    messageDelay: historizedMessage.messageDelay,
    priority: historizedMessage.priority,
    sender: historizedMessage.sender,
    enclosed_file: "",
    notifBindingKeysIds: historizedMessage.notifBindingKeysIds
      .split(",")
      .map(id => parseInt(id)),
  };
  await sendNotifMessage(message);

  // Remove task from database
  await axios.delete(urlScheduledJobs + "/" + scheduledJobId, {
    headers: {
      Authorization: prefs.databaseAuth,
    },
  });

  // Remove message from historizedMessages
  await axios.delete(urlHistorizedMessages + "/" + param1, {
    headers: {
      Authorization: prefs.databaseAuth,
    },
  });
}

/**
 * Backup production databases if NODE_ENV is production, delete the oldest backups if there are more than prefs.maxBackups
 * @returns
 */
export async function backupDatabases(): Promise<void> {
  logger.info("backupDatabases");
  const node_env = process.env.NODE_ENV;
  // if node is test, return
  if (!node_env || node_env === NODE_ENV_TEST) return;
  // else backup databases
  for (const [key, value] of Object.entries(DB_NAMES[node_env])) {
    const backupDatabaseObject: BackupDatabaseObject = {
      description: "scheduled backup",
      dbName: value,
      backupName:
        new Date().toISOString().replace(/[T:]/g, "-").slice(0, 19) + key, // 2011-12-31-23-59-59db_name_....backup
    };
    await backupDatabase(backupDatabaseObject, BACKUP_TYPE.scheduled);

    // get all backups
    const backups = await getBackupsNamesSortByDate(BACKUP_TYPE.scheduled);
    // if there's more than prefs.maxBackups, delete the oldest ones
    if (backups.length > prefs.maxBackups) {
      for await (const backup of backups.slice(
        0,
        backups.length - prefs.maxBackups
      )) {
        fs.unlinkSync(BACKUP_LOCATIONS.scheduled + backup.name);
      }
    }
  }
}
async function purgeOldUserActions(req: Request) {
  logger.info("purgeOldUserActions");
  const olderThan = req.body?.olderThan as string;
  try {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - purgedays); // Purge data older than X days

    const response = await axios.delete(
     urlGeneralUserActions,
      {
        headers: {
          Authorization: prefs.databaseAuth,
        },
        params: {
          olderThan: olderThan, // Get the date as String from the request Body
        },
      }
    );

    if (response.status === 200) {
      logger.info("Data purge completed successfully.");
    } else {
      logger.error(
        "Failed to purge data. Server returned:",
        response.status,
        response.data
      );
    }
  } catch (error) {
    logger.error("Error purging data:", error);
  }
}
