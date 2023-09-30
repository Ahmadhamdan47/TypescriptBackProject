import { EquipmentDatabaseInterface } from "../../src/database/interfaces/equipment.database";
import { LINKED, UNLINKED } from "../../src/server/resources/constants";
import {
  EquipmentEventServerInterface,
  EquipmentServerInterface,
} from "../../src/server/interfaces/equipment.server";

export const newEquipment1: EquipmentServerInterface = {
  audioVideoGid: 1,
  name: "Equipment Test Xellip1",
  label: "Poste Xellip1",
  ipAddress: "192.168.0.43",
  release: "1.0.0",
  camera: "Webcam SD",
  type: "Xellip1",
  canReceiveTextMessage: false,
  domainId: 0,
};
export const newEquipment2: EquipmentServerInterface = {
  audioVideoGid: 2,
  name: "Equipment Test Xellip2",
  label: "Poste Xellip2",
  ipAddress: "192.168.0.44",
  release: "1.0.0",
  camera: "Webcam HD",
  type: "Xellip2",
  canReceiveTextMessage: false,
  domainId: 0,
};
export const newEquipment3: EquipmentServerInterface = {
  audioVideoGid: 3,
  name: "Maylis A",
  label: "Poste Maylis",
  ipAddress: "192.168.0.45",
  release: "1.0.0",
  camera: "Pas de webcam",
  type: "MaylisV1",
  canReceiveTextMessage: true,
  domainId: 0,
};
export const newEquipment4: EquipmentServerInterface = {
  audioVideoGid: 4,
  name: "Maylis B",
  label: "Poste Maylis",
  ipAddress: "192.168.0.43",
  release: "1.0.0",
  camera: "Pas de webcam",
  type: "MaylisV2",
  canReceiveTextMessage: true,
  domainId: 0,
};
export const newEquipments: EquipmentServerInterface[] = [
  newEquipment1,
  newEquipment2,
  newEquipment3,
  newEquipment4,
];

export const newEquipmentDb1: EquipmentDatabaseInterface = {
  id: 1,
  gid: 1,
  name: "Equipment Test Xellip1",
  label: "Poste Xellip1",
  ipAddress: "192.168.0.43",
  release: "1.0.0",
  camera: "Webcam SD",
  status: LINKED,
  equipmentBrandId: 1,
  behaviorId: 1,
  domainId: 1,
  canReceiveTextMessage: false,
  XtvisionEquipmentConfig: { equipmentId: 1, isSupervised: false },
};
export const newEquipmentDb2: EquipmentDatabaseInterface = {
  id: 2,
  gid: 2,
  name: "Equipment Test Xellip2",
  label: "Poste Xellip2",
  ipAddress: "192.168.0.44",
  release: "1.0.0",
  camera: "Webcam HD",
  status: LINKED,
  equipmentBrandId: 2,
  behaviorId: 2,
  domainId: 1,
  canReceiveTextMessage: false,
  XtvisionEquipmentConfig: { equipmentId: 2, isSupervised: false },
};
export const newEquipmentDb3: EquipmentDatabaseInterface = {
  id: 3,
  gid: 3,
  name: "Maylis A",
  label: "Poste Maylis",
  ipAddress: "192.168.0.45",
  release: "1.0.0",
  camera: "Pas de webcam",
  status: LINKED,
  equipmentBrandId: 3,
  behaviorId: 3,
  domainId: 1,
  canReceiveTextMessage: true,
  XtvisionEquipmentConfig: { equipmentId: 3, isSupervised: false },
};
export const newEquipmentDb4: EquipmentDatabaseInterface = {
  id: 4,
  gid: 4,
  name: "Maylis B",
  label: "Poste Maylis",
  ipAddress: "192.168.0.43",
  release: "1.0.0",
  camera: "Pas de webcam",
  status: UNLINKED,
  equipmentBrandId: 4,
  behaviorId: 3,
  domainId: 1,
  canReceiveTextMessage: true,
  XtvisionEquipmentConfig: { equipmentId: 4, isSupervised: false },
};
export const newEquipmentsDb: EquipmentDatabaseInterface[] = [
  newEquipmentDb1,
  newEquipmentDb2,
  newEquipmentDb3,
  newEquipmentDb4,
];

export const newEquipmentEventTrue1: EquipmentEventServerInterface = {
  equipmentId: 1,
  subscribe: true,
};

export const newEquipmentEventTrue2: EquipmentEventServerInterface = {
  equipmentId: 2,
  subscribe: true,
};

export const newEquipmentEventFalse1: EquipmentEventServerInterface = {
  equipmentId: 3,
  subscribe: false,
};

export const newEquipmentEventFalse2: EquipmentEventServerInterface = {
  equipmentId: 4,
  subscribe: false,
};

export const newEquipmentsEvents: EquipmentEventServerInterface[] = [
  newEquipmentEventTrue1,
  newEquipmentEventTrue2,
  newEquipmentEventFalse1,
  newEquipmentEventFalse2,
];
