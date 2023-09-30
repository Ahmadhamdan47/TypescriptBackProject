import { BehaviorDatabaseInterface } from "../../src/database/interfaces/behavior.database";

export const behavior1: BehaviorDatabaseInterface = {
  id: 1,
  name: "Xellip1",
  icon: "Xellip1.jpg",
  equipmentTypeId: 1,
  isDefault: true,
};
export const behavior2: BehaviorDatabaseInterface = {
  id: 2,
  name: "Xellip2",
  icon: "Xellip2.jpg",
  equipmentTypeId: 2,
  isDefault: true,
};
export const behavior3: BehaviorDatabaseInterface = {
  id: 3,
  name: "Maylis",
  icon: "Maylis.jpg",
  equipmentTypeId: 3,
  isDefault: true,
};
export const behavs: BehaviorDatabaseInterface[] = [
  behavior1,
  behavior2,
  behavior3,
];
