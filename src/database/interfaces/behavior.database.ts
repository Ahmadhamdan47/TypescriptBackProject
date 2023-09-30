export interface BehaviorDatabaseInterface {
  id: number;
  name: string;
  icon: string;
  isDefault: boolean;
  equipmentTypeId: number;
}
export type NewBehavior = Omit<BehaviorDatabaseInterface, "id">;
