import {
  EventDatabaseInterface,
  NewEvent,
} from "../../src/database/interfaces/event.database";

export const newEvent: EventDatabaseInterface = {
  id: 1,
  sequenceNumber: 1,
  timestamp: new Date(),
  equipmentProperty: "Interphonie",
  equipmentName: "123",
  stateName: "Communication",
  systemName: "CS",
  params: "Param1;Param2;Param3",
};

export const newEvents: EventDatabaseInterface[] = [newEvent, newEvent];

export const event1: NewEvent = {
  timestamp: new Date("2022-01-01"),
  sequenceNumber: 1,
  equipmentProperty: "INTERCOM",
  equipmentName: "1234",
  stateName: "Communication",
  systemName: "CS",
  params: "Param1;Param2;Param3",
};

export const event2: NewEvent = {
  timestamp: new Date("2022-02-01"),
  sequenceNumber: 2,
  equipmentProperty: "INTERCOM",
  equipmentName: "5679",
  stateName: "Close door",
  systemName: "CS",
  params: "Param1;Param2;Param3",
};

export const event3: NewEvent = {
  timestamp: new Date("2022-03-01"),
  sequenceNumber: 3,
  equipmentProperty: "INTERCOM",
  equipmentName: "888",
  stateName: "SIP subscribed",
  systemName: "CS",
  params: "Param1;Param2;Param3",
};

export const event4: NewEvent = {
  timestamp: new Date("2022-04-01"),
  sequenceNumber: 4,
  equipmentProperty: "EQUIPMENT",
  equipmentName: "247",
  stateName: "Call",
  systemName: "CS",
  params: "Param1;Param2;Param3",
};

export const event5: NewEvent = {
  timestamp: new Date("2022-05-01"),
  sequenceNumber: 5,
  equipmentProperty: "SERVER",
  equipmentName: "247",
  stateName: "Stop call",
  systemName: "CS",
  params: "Param1;Param2;Param3",
};

export const event6: NewEvent = {
  timestamp: new Date("2022-06-01"),
  sequenceNumber: 6,
  equipmentProperty: "DOOR",
  equipmentName: "247",
  stateName: "Stop call",
  systemName: "CS",
  params: "Param1;Param2;Param3",
};

export const events: NewEvent[] = [
  event1,
  event2,
  event3,
  event4,
  event5,
  event6,
];
