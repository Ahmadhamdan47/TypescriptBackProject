export interface EventDatabaseInterface {
  id: number;
  sequenceNumber: number;
  timestamp: Date;
  equipmentProperty: string;
  equipmentName: string;
  stateName: string;
  systemName: string;
  params: any;
}

export type NewEvent = Omit<EventDatabaseInterface, "id">;
