export interface BrandStateDatabaseInterface {
  EquipmentBrandId: number;
  StateId: number;
}

export type NewBrandState = Required<BrandStateDatabaseInterface>;
