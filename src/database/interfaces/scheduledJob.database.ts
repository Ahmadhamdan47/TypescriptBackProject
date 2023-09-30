export interface ScheduledJobDatabaseInterface {
  id: number;
  name: string;
  description?: string;
  task: string;
  date?: Date;
  cron?: string;
  param1?: number;
  active?: boolean;
}

export type NewScheduledJob = Omit<ScheduledJobDatabaseInterface, "id">;
