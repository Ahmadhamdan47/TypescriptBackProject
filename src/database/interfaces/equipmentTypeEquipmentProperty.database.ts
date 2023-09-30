export interface EquipmentTypeEquipmentPropertyDatabaseInterface {
  EquipmentTypeId: number;
  EquipmentPropertyId: number;
}

export type NewEquipmentTypeEquipmentProperty =
  Required<EquipmentTypeEquipmentPropertyDatabaseInterface>;
