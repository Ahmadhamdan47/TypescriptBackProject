export interface UserDatabaseInterface {
  id: number;
  name: string;
  description: string;
  language: string;
  time_zone: string;
  roleIds?: number[];
  dashboardIds?: number[];
  managementAreaIds?: number[];
}
export type NewUser = Omit<UserDatabaseInterface, "id">;
