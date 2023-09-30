import { BehaviorDatabaseInterface } from "../../database/interfaces/behavior.database";
import { BehaviorStateDatabaseInterface } from "../../database/interfaces/behaviorState.database";
import { BehaviorPropertyDatabaseInterface } from "../../database/interfaces/behaviorProperty.database";
import { EquipmentDatabaseInterface } from "../../database/interfaces/equipment.database";
import { EquipmentServerInterface } from "./equipment.server";

export interface EventServerInterface {
  sequenceNumber: number;
  timestamp: Date;
  equipmentProperty: string;
  equipmentGid: number;
  stateName: string;
  systemId: number;
  systemName: string;
  params: any;
  paramsEquipment: EquipmentServerInterface | any;
}

/**
 * Object filled from EventServerInterface which contains all objects needed to do some processings on the database, Back and Front
 */
export interface FullEventServerInterface {
  behavior: BehaviorDatabaseInterface;
  behaviorProperty: BehaviorPropertyDatabaseInterface;
  behaviorState: BehaviorStateDatabaseInterface;
  equipment: EquipmentDatabaseInterface;
  event: EventServerInterface;
}

/**
 * Event sent to the Front
 */
export interface FrontEventServerInterface {
  state: string;
  equipmentName: string;
  equipmentProperty: string;
  icon: string;
}
