export interface NotifPredefinedMessageDatabaseInterface {
  id: string;
  title: string;
  body: string;
  messageTtl: number; // seconds
  messageDelay: number; // seconds
  priority: string;
  sender: string;
}
export type NewNotifPredefinedMessage = Omit<
  NotifPredefinedMessageDatabaseInterface,
  "id"
>;
