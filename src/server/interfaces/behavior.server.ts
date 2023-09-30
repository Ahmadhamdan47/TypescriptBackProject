import { BehaviorPropertyDatabaseInterface } from "../../database/interfaces/behaviorProperty.database";

export interface BehaviorServerInterface {
  id: number;
  name: string;
  icon: string;
  equipmentTypeId: number;
  isDefault: boolean;
  BehaviorProperties: BehaviorPropertyDatabaseInterface[];
}
