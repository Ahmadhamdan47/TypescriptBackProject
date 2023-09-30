export interface ActionTypeDatabaseInterface {
  id: number;
  name: string;
  equipmentPropertyId: number;
}

export type NewActionType = Omit<ActionTypeDatabaseInterface, "id">;
