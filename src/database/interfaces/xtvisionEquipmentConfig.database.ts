export interface XtvisionEquipmentConfigDatabaseInterface {
  equipmentId: number;
  isSupervised: boolean;
}

export type NewXtvisionEquipmentConfig =
  Required<XtvisionEquipmentConfigDatabaseInterface>;
