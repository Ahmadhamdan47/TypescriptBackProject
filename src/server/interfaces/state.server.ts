import { ParamDatabaseInterface } from "../../database/interfaces/param.database";

export interface StateServerInterface {
  id: number;
  name: string;
  equipmentPropertyId: number;
  Params: ParamDatabaseInterface[];
}
