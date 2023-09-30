export interface ManagementAreaUserDatabaseInterface {
  ManagementAreaId: number;
  UserId: number;
}

export type NewManagementAreaUser =
  Required<ManagementAreaUserDatabaseInterface>;
