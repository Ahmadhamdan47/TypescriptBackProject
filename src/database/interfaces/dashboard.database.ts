export interface DashboardDatabaseInterface {
  id: number;
  name: string;
  description: string;
  layout: string;
  widgets: string;
  userIds?: number[];
}
export type NewDashboard = Omit<DashboardDatabaseInterface, "id">;
