export interface EquipmentBrandDatabaseInterface {
  id: number;
  name: string;
  equipmentTypeId: number;
}

export type NewEquipmentBrand = Omit<EquipmentBrandDatabaseInterface, "id">;
