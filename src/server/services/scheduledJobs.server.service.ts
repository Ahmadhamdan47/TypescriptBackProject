import { Server } from "http";
import config from "../resources/config";
import { prefs, customAxios as axios } from "../../webServer";
import nodeSchedule from "node-schedule";
import { ScheduledJobsNames } from "../jobs/initScheduling.server.job";
import { NewScheduledJob } from "../../database/interfaces/scheduledJob.database";
import { logger } from "../../../logger";
import { ScheduledJob } from "../../database/models/scheduledJobs.model";

export class ScheduledJobServerService {
  constructor(protected server: Server) {}

  async insertScheduledJob(newJob: NewScheduledJob): Promise<ScheduledJob> {
    logger.info("insertScheduledJob");
    const jobId = (
      await axios.post(config.xtvision.databaseUrl + "/scheduledJobs", newJob, {
        headers: {
          Authorization: prefs.databaseAuth,
        },
      })
    ).data;
    // get job
    const job = await this.getScheduledJobById(jobId);

    // Schedule job
    if (job.date) {
      nodeSchedule.scheduleJob(job.id.toString(), job.date, async () => {
        ScheduledJobsNames[job.task](job.id, job.param1);
      });
    } else if (job.cron && job.active) {
      nodeSchedule.scheduleJob(job.id.toString(), job.cron, async () => {
        ScheduledJobsNames[job.task](job.id, job.param1);
      });
    }
    return job;
  }

  async getScheduledJobs() {
    logger.info("getScheduledJobs");
    return (
      await axios.get(config.xtvision.databaseUrl + "/scheduledJobs", {
        headers: {
          Authorization: prefs.databaseAuth,
        },
      })
    ).data as ScheduledJob[];
  }

  async getScheduledJobById(id: string) {
    logger.info("getScheduledJobById");
    return (
      await axios.get(config.xtvision.databaseUrl + "/scheduledJobs/" + id, {
        headers: {
          Authorization: prefs.databaseAuth,
        },
      })
    ).data as ScheduledJob;
  }

  async updateScheduledJobActiveStatusById(
    id: string,
    params: { active: boolean }
  ) {
    logger.info("updateScheduledJobActiveStatusById");
    // update nodeSchedule
    if (!params.active) {
      nodeSchedule.cancelJob(id);
    } else {
      const job = await this.getScheduledJobById(id);
      // Schedule job
      nodeSchedule.scheduleJob(id.toString(), job.cron, async () => {
        ScheduledJobsNames[job.task](job.id, job.param1);
      });
    }

    await axios.put(
      config.xtvision.databaseUrl + "/scheduledJobs/" + id,
      params,
      {
        headers: {
          Authorization: prefs.databaseAuth,
        },
      }
    );
  }

  async deleteScheduledJobById(id: string) {
    logger.info("deleteScheduledJobById");
    nodeSchedule.cancelJob(id);

    // delete message from scheduled jobs db
    await axios.delete(config.xtvision.databaseUrl + "/scheduledJobs/" + id, {
      headers: {
        Authorization: prefs.databaseAuth,
      },
    });
  }
}
