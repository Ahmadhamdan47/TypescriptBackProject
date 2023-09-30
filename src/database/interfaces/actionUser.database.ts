export interface ActionUserDatabaseInterface {
  id: string;
  action: string;
  timestamp: string;
  category: string;
  settings: string[];
}
export type NewActionUser = Omit<ActionUserDatabaseInterface, "id">;
