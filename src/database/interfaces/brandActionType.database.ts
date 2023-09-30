export interface BrandActionTypeDatabaseInterface {
  EquipmentBrandId: number;
  ActionTypeId: number;
}

export type NewBrandActionType = Required<BrandActionTypeDatabaseInterface>;
