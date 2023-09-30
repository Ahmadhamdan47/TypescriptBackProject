export interface EquipmentTypeDatabaseInterface {
  id: number;
  name: string;
  systemId: number;
}

export type NewEquipmentType = Omit<EquipmentTypeDatabaseInterface, "id">;
