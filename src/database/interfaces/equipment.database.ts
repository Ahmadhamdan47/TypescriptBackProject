import { XtvisionEquipmentConfigDatabaseInterface } from "./xtvisionEquipmentConfig.database";

export interface EquipmentDatabaseInterface {
  id: number;
  gid: number;
  name: string;
  label: string;
  ipAddress: string;
  release: string;
  camera: string;
  status: string;
  canReceiveTextMessage: boolean;
  equipmentBrandId: number;
  behaviorId: number;
  domainId: number;
  systemId?: number;
  XtvisionEquipmentConfig: XtvisionEquipmentConfigDatabaseInterface;
}

export type NewEquipment = Omit<
  EquipmentDatabaseInterface,
  "id" | "XtvisionEquipmentConfig"
>;
