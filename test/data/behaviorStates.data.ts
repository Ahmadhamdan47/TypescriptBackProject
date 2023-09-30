import { BehaviorStateDatabaseInterface } from "../../src/database/interfaces/behaviorState.database";

export const behaviorState1: BehaviorStateDatabaseInterface = {
  id: 1,
  stateId: 1,
  name: "Communication",
  icon: "bfhabafbhdsbfhsdbfhsbfsdbdfshjsdf",
  isAlarm: true,
  isFault: false,
  mustBeArchived: true,
  behaviorPropertyId: 2,
};
export const behaviorState2: BehaviorStateDatabaseInterface = {
  id: 2,
  stateId: 2,
  name: "Open door",
  icon: "15615648485fds465fds68f44d86fdsfdss",
  isAlarm: false,
  isFault: false,
  mustBeArchived: true,
  behaviorPropertyId: 1,
};
export const behavsStates: BehaviorStateDatabaseInterface[] = [
  behaviorState1,
  behaviorState2,
];
