import { BehaviorBehaviorPropertyDatabaseInterface } from "../../src/database/interfaces/behaviorBehaviorProperty.database";
import { BehaviorPropertyDatabaseInterface } from "../../src/database/interfaces/behaviorProperty.database";

export const behaviorProperty1: BehaviorPropertyDatabaseInterface = {
  id: 1,
  equipmentPropertyId: 1,
  name: "Variable liée à l'état général d'un interphone",
};
export const behaviorProperty2: BehaviorPropertyDatabaseInterface = {
  id: 2,
  equipmentPropertyId: 2,
  name: "Variable pour la gestion des communications d'un interphone",
};
export const behaviorProperty3: BehaviorPropertyDatabaseInterface = {
  id: 3,
  equipmentPropertyId: 3,
  name: "Variable liée aux actions d'un interphone",
};
export const behavsProps: BehaviorPropertyDatabaseInterface[] = [
  behaviorProperty1,
  behaviorProperty2,
  behaviorProperty3,
];

export const bbv1: BehaviorBehaviorPropertyDatabaseInterface = {
  BehaviorPropertyId: 1,
  BehaviorId: 1,
};
export const bbv2: BehaviorBehaviorPropertyDatabaseInterface = {
  BehaviorPropertyId: 1,
  BehaviorId: 2,
};
export const bbv4: BehaviorBehaviorPropertyDatabaseInterface = {
  BehaviorPropertyId: 2,
  BehaviorId: 1,
};
export const bbv5: BehaviorBehaviorPropertyDatabaseInterface = {
  BehaviorPropertyId: 2,
  BehaviorId: 2,
};
export const bbv3: BehaviorBehaviorPropertyDatabaseInterface = {
  BehaviorPropertyId: 2,
  BehaviorId: 3,
};
export const bbv6: BehaviorBehaviorPropertyDatabaseInterface = {
  BehaviorPropertyId: 3,
  BehaviorId: 1,
};
export const bbv7: BehaviorBehaviorPropertyDatabaseInterface = {
  BehaviorPropertyId: 3,
  BehaviorId: 2,
};
export const bbv: BehaviorBehaviorPropertyDatabaseInterface[] = [
  bbv1,
  bbv2,
  bbv3,
  bbv4,
  bbv5,
  bbv6,
  bbv7,
];
