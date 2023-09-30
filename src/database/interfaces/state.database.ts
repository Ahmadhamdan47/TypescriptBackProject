export interface StateDatabaseInterface {
  id: number;
  name: string;
  equipmentPropertyId: number;
}

export type NewState = Omit<StateDatabaseInterface, "id">;
