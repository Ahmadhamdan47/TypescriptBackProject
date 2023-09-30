export interface EquipmentNotifBindingKeyDatabaseInterface {
  EquipmentId: number;
  NotifBindingKeyId: number;
}

export type NewEquipmentNotifBindingKey =
  Required<EquipmentNotifBindingKeyDatabaseInterface>;
