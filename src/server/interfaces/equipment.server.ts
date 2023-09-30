export interface EquipmentServerInterface {
  audioVideoGid: number;
  name: string;
  label: string;
  ipAddress: string;
  release: string;
  camera: string;
  type: string; // Type in system means Brand in XtVision
  canReceiveTextMessage: boolean;
  domainId: number;
}

export interface SubscribeEquipmentServerInterface {
  gid: number;
  name: string;
  ipAddress: string;
}

export interface EquipmentEventServerInterface {
  systemId?: number;
  equipmentTypeId?: number;
  equipmentId: number;
  equipmentGid?: number;
  subscribe: boolean;
}
