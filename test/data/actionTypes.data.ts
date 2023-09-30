import { ActionTypeDatabaseInterface } from "../../src/database/interfaces/actionType.database";

export const actionType1: ActionTypeDatabaseInterface = {
  id: 1,
  name: "Close door",
  equipmentPropertyId: 3,
};
export const actionType2: ActionTypeDatabaseInterface = {
  id: 2,
  name: "Call",
  equipmentPropertyId: 3,
};
export const actionTypes: ActionTypeDatabaseInterface[] = [
  actionType1,
  actionType2,
];
