export interface RoleUserDatabaseInterface {
  RoleId: number;
  UserId: number;
}

export type NewRoleUser =
  Required<RoleUserDatabaseInterface>;
