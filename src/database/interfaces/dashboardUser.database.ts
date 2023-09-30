export interface DashboardUserDatabaseInterface {
  DashboardId: number;
  UserId: number;
}

export type NewDashboardUser =
  Required<DashboardUserDatabaseInterface>;
