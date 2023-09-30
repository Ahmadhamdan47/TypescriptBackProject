import { EquipmentNotifBindingKeyDatabaseInterface } from "../../src/database/interfaces/equipmentNotifBindingKey.database";
import {
  NotifBindingKeyDatabaseInterface,
  SendingMode,
} from "../../src/database/interfaces/notifBindingKey.database";
import { NotifServerBinding } from "../../src/server/interfaces/notifBindingKey.server";

export const notifBindingKey1: NotifBindingKeyDatabaseInterface = {
  id: 1,
  name: "Tous mes potes",
  systemId: 2,
  defaultMessageTtl: 3600 * 24,
  sendingMode: SendingMode.Unique,
};
export const notifBindingKey2: NotifBindingKeyDatabaseInterface = {
  id: 2,
  name: "Tous mes meilleurs potes",
  systemId: 2,
  defaultMessageTtl: 3600 * 48,
  sendingMode: SendingMode.Unique,
};
export const notifBindingKeys: NotifBindingKeyDatabaseInterface[] = [
  notifBindingKey1,
  notifBindingKey2,
];

export const EquipmentNotifBindingKey1: EquipmentNotifBindingKeyDatabaseInterface =
  {
    EquipmentId: 3,
    NotifBindingKeyId: 1,
  };

export const EquipmentNotifBindingKey2: EquipmentNotifBindingKeyDatabaseInterface =
  {
    EquipmentId: 4,
    NotifBindingKeyId: 2,
  };

export const EquipmentsNotifBindingKeys: EquipmentNotifBindingKeyDatabaseInterface[] =
  [EquipmentNotifBindingKey1, EquipmentNotifBindingKey2];

export const notifServerBindings: NotifServerBinding[] = [
  {
    sender: "",
    vhost: "/",
    destination: "common_caserne",
    destination_type: "queue",
    routing_key: "common_caserne",
    arguments: {},
    properties_key: "common_caserne",
  },
  {
    sender: "",
    vhost: "/",
    destination: "1",
    destination_type: "queue",
    routing_key: "1",
    arguments: {},
    properties_key: "1",
  },
  {
    sender: "",
    vhost: "/",
    destination: "2",
    destination_type: "queue",
    routing_key: "2",
    arguments: {},
    properties_key: "2",
  },
  {
    sender: "",
    vhost: "/",
    destination: "3",
    destination_type: "queue",
    routing_key: "3",
    arguments: {},
    properties_key: "3",
  },
  {
    sender: "topic_messages",
    vhost: "/",
    destination: "common_caserne",
    destination_type: "queue",
    routing_key: "common_caserne",
    arguments: {},
    properties_key: "common_caserne",
  },
  {
    sender: "topic_messages",
    vhost: "/",
    destination: "1",
    destination_type: "queue",
    routing_key: "caserne",
    arguments: {},
    properties_key: "caserne",
  },
  {
    sender: "topic_messages",
    vhost: "/",
    destination: "1",
    destination_type: "queue",
    routing_key: "caserne.bat1",
    arguments: {},
    properties_key: "caserne.bat1",
  },
  {
    sender: "topic_messages",
    vhost: "/",
    destination: "1",
    destination_type: "queue",
    routing_key: "caserne.bat1.etage2",
    arguments: {},
    properties_key: "caserne.bat1.etage2",
  },
  {
    sender: "topic_messages",
    vhost: "/",
    destination: "1",
    destination_type: "queue",
    routing_key: "1",
    arguments: {},
    properties_key: "1",
  },
  {
    sender: "topic_messages",
    vhost: "/",
    destination: "2",
    destination_type: "queue",
    routing_key: "caserne",
    arguments: {},
    properties_key: "caserne",
  },
  {
    sender: "topic_messages",
    vhost: "/",
    destination: "2",
    destination_type: "queue",
    routing_key: "caserne.bat2",
    arguments: {},
    properties_key: "caserne.bat2",
  },
  {
    sender: "topic_messages",
    vhost: "/",
    destination: "2",
    destination_type: "queue",
    routing_key: "caserne.bat2.etage1",
    arguments: {},
    properties_key: "caserne.bat2.etage1",
  },
  {
    sender: "topic_messages",
    vhost: "/",
    destination: "2",
    destination_type: "queue",
    routing_key: "2",
    arguments: {},
    properties_key: "2",
  },
  {
    sender: "topic_messages",
    vhost: "/",
    destination: "3",
    destination_type: "queue",
    routing_key: "caserne",
    arguments: {},
    properties_key: "caserne",
  },
  {
    sender: "topic_messages",
    vhost: "/",
    destination: "3",
    destination_type: "queue",
    routing_key: "caserne.bat2",
    arguments: {},
    properties_key: "caserne.bat2",
  },
  {
    sender: "topic_messages",
    vhost: "/",
    destination: "3",
    destination_type: "queue",
    routing_key: "caserne.bat2.etage2",
    arguments: {},
    properties_key: "caserne.bat2.etage2",
  },
  {
    sender: "topic_messages",
    vhost: "/",
    destination: "3",
    destination_type: "queue",
    routing_key: "3",
    arguments: {},
    properties_key: "3",
  },
];

export const notifServerConnections: any[] = [
  {
    user: "user1",
  },
  {
    user: "user2",
  },
];
