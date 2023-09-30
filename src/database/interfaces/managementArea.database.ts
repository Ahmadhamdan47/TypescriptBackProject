export interface ManagementAreaDatabaseInterface {
  id: number;
  name: string;
  description: string;
  userIds?: number[];
}
export type NewManagementArea = Omit<ManagementAreaDatabaseInterface, "id">;
