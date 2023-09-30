import { EquipmentTypeDatabaseInterface } from "../../src/database/interfaces/equipmentType.database";

export const equipmentType1: EquipmentTypeDatabaseInterface = {
  id: 1,
  name: "Xellip1",
  systemId: 1,
};
export const equipmentType2: EquipmentTypeDatabaseInterface = {
  id: 2,
  name: "Xellip2",
  systemId: 1,
};
export const equipmentType3: EquipmentTypeDatabaseInterface = {
  id: 3,
  name: "Maylis",
  systemId: 1,
};
export const equipmentTypes: EquipmentTypeDatabaseInterface[] = [
  equipmentType1,
  equipmentType2,
  equipmentType3,
];
