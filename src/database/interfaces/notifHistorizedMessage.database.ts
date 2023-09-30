export interface NotifHistorizedMessageDatabaseInterface {
  id: string;
  systemId: number;
  serverUuid: string; // message's uuid used by RabbitMQ
  status: string;
  title: string;
  body: string;
  messageTtl: number; // seconds
  messageDelay: number; // seconds
  priority: string;
  sender: string;
  notifBindingKeysIds: string;
  notifBindingKeysNames: string;
}
export type NewNotifHistorizedMessage = Omit<
  NotifHistorizedMessageDatabaseInterface,
  "id"
>;
