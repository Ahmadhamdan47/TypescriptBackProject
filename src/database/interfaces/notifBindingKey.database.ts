export interface NotifBindingKeyDatabaseInterface {
  id: number;
  name: string;
  defaultMessageTtl: number;
  systemId: number;
  sendingMode: SendingMode;
}
export type NewNotifBindingKey = Omit<NotifBindingKeyDatabaseInterface, "id">;

export enum SendingMode {
  Unique = "Unique",
  Common = "Common",
}
