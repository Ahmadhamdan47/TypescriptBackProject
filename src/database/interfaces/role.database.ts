export interface RoleDatabaseInterface {
  id: number;
  name: string;
  description: string;
  featureIds?: number[];
  userIds?: number[];
}
export type NewRole = Omit<RoleDatabaseInterface, "id">;
