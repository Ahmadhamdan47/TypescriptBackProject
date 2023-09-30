import { ParamDatabaseInterface } from "../../database/interfaces/param.database";

export interface ActionTypeServerInterface {
  id: number;
  name: string;
  equipmentPropertyId: number;
  Params: ParamDatabaseInterface[];
}
