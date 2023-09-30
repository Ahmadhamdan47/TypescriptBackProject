export interface BehaviorPropertyDatabaseInterface {
  id: number;
  equipmentPropertyId: number;
  name: string;
}
export type NewBehaviorProperty = Omit<BehaviorPropertyDatabaseInterface, "id">;
