export interface CurrentEquipmentStateDatabaseInterface {
  id: number;
  equipmentId: number;
  equipmentPropertyId: number;
  currentStateId: number;
}

export type NewCurrentEquipmentState = Omit<
  CurrentEquipmentStateDatabaseInterface,
  "id"
>;
