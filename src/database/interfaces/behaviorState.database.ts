export interface BehaviorStateDatabaseInterface {
  id: number;
  name: string;
  stateId: number;
  icon: string;
  isAlarm: boolean;
  isFault: boolean;
  mustBeArchived: boolean;
  behaviorPropertyId: number;
}
export type NewBehaviorState = Omit<BehaviorStateDatabaseInterface, "id">;
