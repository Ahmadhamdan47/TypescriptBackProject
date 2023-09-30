import { CurrentEquipmentStateDatabaseInterface } from "../../src/database/interfaces/currentEquipmentState.database";
import { CurrentEquipmentStateServerInterface } from "../../src/server/interfaces/currentEquipmentState.server";

export const newEquipmentState1: CurrentEquipmentStateServerInterface = {
  gid: 1,
  equipmentsPropertiesStates: [
    {
      equipmentProperty: "Variable liée à l'état général d'un interphone",
      state: "Open door",
    },
    {
      equipmentProperty:
        "Variable pour la gestion des communications d'un interphone",
      state: "Communication",
    },
  ],
};
export const newEquipmentState2: CurrentEquipmentStateServerInterface = {
  gid: 2,
  equipmentsPropertiesStates: [
    {
      equipmentProperty: "Variable liée à l'état général d'un interphone",
      state: "Open door",
    },
    {
      equipmentProperty:
        "Variable pour la gestion des communications d'un interphone",
      state: "Communication",
    },
  ],
};
export const newEquipmentState3: CurrentEquipmentStateServerInterface = {
  gid: 3,
  equipmentsPropertiesStates: [
    {
      equipmentProperty:
        "Variable pour la gestion des communications d'un interphone",
      state: "Communication",
    },
  ],
};
export const newEquipmentState4: CurrentEquipmentStateServerInterface = {
  gid: 4,
  equipmentsPropertiesStates: [
    {
      equipmentProperty:
        "Variable pour la gestion des communications d'un interphone",
      state: "Communication",
    },
  ],
};
export const newEquipmentsStates: CurrentEquipmentStateServerInterface[] = [
  newEquipmentState1,
  newEquipmentState2,
  newEquipmentState3,
  newEquipmentState4,
];

export const newEquipmentStateDb1: CurrentEquipmentStateDatabaseInterface = {
  id: 1,
  equipmentId: 1,
  equipmentPropertyId: 1,
  currentStateId: 2,
};
export const newEquipmentStateDb2: CurrentEquipmentStateDatabaseInterface = {
  id: 2,
  equipmentId: 1,
  equipmentPropertyId: 2,
  currentStateId: 1,
};
export const newEquipmentStateDb3: CurrentEquipmentStateDatabaseInterface = {
  id: 3,
  equipmentId: 2,
  equipmentPropertyId: 1,
  currentStateId: 2,
};
export const newEquipmentStateDb4: CurrentEquipmentStateDatabaseInterface = {
  id: 4,
  equipmentId: 2,
  equipmentPropertyId: 2,
  currentStateId: 1,
};
export const newEquipmentStateDb5: CurrentEquipmentStateDatabaseInterface = {
  id: 5,
  equipmentId: 3,
  equipmentPropertyId: 2,
  currentStateId: 1,
};
export const newEquipmentStateDb6: CurrentEquipmentStateDatabaseInterface = {
  id: 6,
  equipmentId: 4,
  equipmentPropertyId: 2,
  currentStateId: 1,
};
export const newEquipmentsStatesDb: CurrentEquipmentStateDatabaseInterface[] = [
  newEquipmentStateDb1,
  newEquipmentStateDb2,
  newEquipmentStateDb3,
  newEquipmentStateDb4,
  newEquipmentStateDb5,
  newEquipmentStateDb6,
];
