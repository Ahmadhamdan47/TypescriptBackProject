import { Server } from "http";
import { logger } from "../../../logger";
import { ScheduledJob } from "../models/scheduledJobs.model";
import { NewScheduledJob } from "../interfaces/scheduledJob.database";

export class ScheduledJobsDatabaseService {
  constructor(protected server: Server) {}

  /**
   * This function inserts a scheduled job in the database
   * @param scheduledJob can be a date for single time scheduling or a cron string for periodic scheduling
   * @returns
   */
  async insertScheduledJob(scheduledJob: NewScheduledJob): Promise<number> {
    logger.info("insertScheduledJob");
    try {
      return (await ScheduledJob.create(scheduledJob)).id;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveAllScheduledJobs(): Promise<ScheduledJob[] | null> {
    logger.info("retrieveAllScheduledJobs");
    try {
      return await ScheduledJob.findAll();
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveOneScheduledJobById(id: string): Promise<ScheduledJob | null> {
    logger.info("retrieveOneScheduledJobById");
    try {
      return await ScheduledJob.findByPk(id);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async updateScheduledJobById(id: string, scheduledJob: any): Promise<void> {
    logger.info("updateScheduledJobById");
    try {
      await ScheduledJob.update(scheduledJob, {
        where: { id },
      });
      return;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async deleteAllScheduledJobs(): Promise<number> {
    logger.info("deleteAllScheduledJobs");
    try {
      return await ScheduledJob.destroy({ where: {} });
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async deleteOneScheduledJobById(id: string): Promise<number> {
    logger.info("deleteOneScheduledJobById");
    try {
      return await ScheduledJob.destroy({ where: { id } });
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }
}
