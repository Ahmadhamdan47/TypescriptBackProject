import { EnumScheduledJobsNames } from "../jobs/initScheduling.server.job";

export interface ScheduledJobsServerInterface {
  name: EnumScheduledJobsNames;
  date?: Date;
  cron?: string;
  param1?: number;
  active?: boolean;
}
