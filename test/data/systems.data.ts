import { SystemDatabaseInterface } from "../../src/database/interfaces/system.database";
import { httPrefix, isHttpS } from "../../src/server/resources/config";
import {
  CASTELSUITE,
  CONNECTED,
  RABBITMQ,
  WS,
  WSS,
} from "../../src/server/resources/constants";
import {
  AddSystemServerInterface,
  AuthMode,
} from "../../src/server/interfaces/addSystem.server";
import {
  SystemServerInterface,
  RabbitMQServerInterface,
} from "../../src/server/interfaces/system.server";

export const newCastelSuiteSystem: SystemServerInterface = {
  release: "1.0.0",
  equipmentsTypes: ["Xellip1", "Xellip2", "Maylis"],
};

export const newCastelSuiteDb: SystemDatabaseInterface = {
  id: 1,
  name: "CastelSuite 1",
  kind: "Intercom, access control",
  address: `${httPrefix}`,
  url_connexion_api: `${httPrefix}:5002/CASTELSuite/xtvision`,
  url_connexion_ws: `${
    isHttpS ? WSS : WS
  }localhost:5002/CASTELSuite/ws/xtvision_event`,
  release: "1.0.0",
  state: CONNECTED,
  brand: CASTELSUITE,
  port: "5002",
  createdBy: "xtvision",
  updatedBy: "xtvision",
  createdAt: new Date(),
  updatedAt: new Date(),
  authMode: AuthMode.Basic,
  user: "castel",
  password: "ca6632921c1d",
};

export const addCastelSuiteSystem: AddSystemServerInterface = {
  name: "CastelSuite 1",
  kind: "Intercom, access control",
  address: `${httPrefix}`,
  brand: CASTELSUITE,
  category: "",
  managementArea: "",
  port: "5002",
  createdBy: "xtvision",
  authMode: AuthMode.Basic,
  user: "castel",
  password: "castel",
};

export const newRabbitMQSystem: RabbitMQServerInterface = {
  management_version: "2.0.0",
  object_totals: {
    channels: 0,
    connections: 0,
    consumers: 0,
    exchanges: 9,
    queues: 4,
  },
};

export const addRabbitMqSystem: AddSystemServerInterface = {
  name: "RabbitMQ 1",
  kind: "Text message",
  address: `${httPrefix}`,
  brand: RABBITMQ,
  category: "",
  managementArea: "",
  port: "5003",
  createdBy: "xtvision",
  authMode: AuthMode.Basic,
  user: "guest",
  password: "guest",
};

export const newRabbitMQDb: SystemDatabaseInterface = {
  id: 2,
  name: "RabbitMQ 1",
  kind: "Text message",
  brand: RABBITMQ,
  address: `${httPrefix}`,
  port: "5003",
  url_connexion_api: `${httPrefix}:5003/api`,
  url_connexion_ws: "",
  release: "2.0.0",
  state: CONNECTED,
  createdBy: "xtvision",
  updatedBy: "xtvision",
  createdAt: new Date(),
  updatedAt: new Date(),
  authMode: AuthMode.Basic,
  user: "guest",
  password: "ce7224950d",
};
