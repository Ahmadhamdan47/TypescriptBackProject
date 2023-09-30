import { StateDatabaseInterface } from "../../src/database/interfaces/state.database";

export const state1: StateDatabaseInterface = {
  id: 1,
  name: "Communication",
  equipmentPropertyId: 2,
};
export const state2: StateDatabaseInterface = {
  id: 2,
  name: "Open door",
  equipmentPropertyId: 1,
};
export const states: StateDatabaseInterface[] = [state1, state2];
