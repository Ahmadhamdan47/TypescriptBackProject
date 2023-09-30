import { ParamDatabaseInterface } from "../../src/database/interfaces/param.database";
import { ActionTypeParamDatabaseInterface } from "../../src/database/interfaces/actionTypeParam.database";
import { StateParamDatabaseInterface } from "../../src/database/interfaces/stateParam.database";

export const param1: ParamDatabaseInterface = {
  id: 1,
  nameId: "State",
  labelFr: "Etat",
  labelEn: "State",
  kind: "list",
  paramValues: JSON.stringify({
    values: ["Marche", "Arrêt"],
  }),
};
export const param2: ParamDatabaseInterface = {
  id: 2,
  nameId: "Delay",
  labelFr: "Délai",
  labelEn: "Delay",
  kind: "int",
  paramValues: JSON.stringify({
    valueMin: 1,
    valueMax: 10,
  }),
};
export const param3: ParamDatabaseInterface = {
  id: 3,
  nameId: "Intercom event",
  labelFr: "Evènement interphonie",
  labelEn: "Intercom event",
  kind: "list",
  paramValues: "",
};
export const params: ParamDatabaseInterface[] = [param1, param2, param3];

export const sp1: StateParamDatabaseInterface = {
  ParamId: 3,
  StateId: 1,
};
export const sps: StateParamDatabaseInterface[] = [sp1];

export const tap1: ActionTypeParamDatabaseInterface = {
  ParamId: 1,
  ActionTypeId: 1,
};
export const tap2: ActionTypeParamDatabaseInterface = {
  ParamId: 2,
  ActionTypeId: 1,
};
export const taps: ActionTypeParamDatabaseInterface[] = [tap1, tap2];
