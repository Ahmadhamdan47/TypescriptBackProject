export interface EquipmentPropertyDatabaseInterface {
  id: number;
  name: string;
}

export type NewEquipmentProperty = Omit<
  EquipmentPropertyDatabaseInterface,
  "id"
>;
