import * as config from "../../database/config/config.json";

// Systems brands
export const CASTELSUITE = "CastelSuite";
export const SYNCHRONIC = "Synchronic";
export const RABBITMQ = "RabbitMQ";

// Systems attributes
export const CONNECTED = "Connected";
export const DISCONNECTED = "Disconnected";
export const HTTPS = "https://";
export const HTTP = "http://";
export const WSS = "wss://";
export const WS = "ws://";

// Equipments attributes
export const LINKED = "LINKED";
export const UNLINKED = "UNLINKED";

// Events attributes
export const EQUIPMENT = "equipment";
export const ADD_EQUIPMENT = "add_equipment";
export const REMOVE_EQUIPMENT = "remove_equipment";
export const SYSTEM = "system";
export const SYSTEM_STARTED = "system_started";
export const SYSTEM_STOPPED = "system_stopped";

// XtVision releases
export const RELEASES: { [K: string]: number } = {
  V1_0_0: 10000,
  V2_0_0: 20000,
};

// Authentications modes (local is for our Keycloak server and away is for a new OIDC/OAuth2 server)
export const AUTH_MODE: { [K: string]: string } = {
  // OAuth2
  OAUTH2_LOCAL: "AUTH_OAUTH2_LOCAL",
  OAUTH2_AWAY: "AUTH_OAUTH2_AWAY",
  // Open Id Connect = OAuth2 + user info in id_token
  OIDC_LOCAL: "AUTH_OIDC_LOCAL",
  OIDC_AWAY: "AUTH_OIDC_AWAY",
};

// Authentifications attributes
export const CLIENT_ID = "client_id";
export const CLIENT_SECRET = "client_secret";
export const CODE = "code";
export const AUTHORIZATION_CODE = "authorization_code";
export const REDIRECT_URI = "redirect_uri";
export const GRANT_TYPE = "grant_type";
export const REFRESH_TOKEN = "refresh_token";
export const BEARER = "Bearer ";
export const CLIENT_CREDENTIALS = "client_credentials";
export const ACCESS_TOKEN = "access_token";
export const TOKEN = "token";
export const TOKEN_TYPE_HINT = "token_type_hint";
export const PASSWORD = "password";
export const BASIC = "Basic ";
export const BASE64 = "base64";
export const ASCII = "ascii";

// Node env
export const NODE_ENV_DEV = "development";
export const NODE_ENV_TEST = "test";
export const NODE_ENV_PROD = "production";

// Pagination
export const PAGINATION_DEFAULT_SIZE = 40; // Default quantity of items to fetch
export const PAGINATION_DEFAULT_OFFSET = 0; // Default quantity of items to skip

// AES
export const AES_PREFIX = "yhlf5ai8wVgRH7B48QgE";

// RabbitMQ
// this is the exchange used by RabbitMQ server to broke messages:
// API calls use it to know where the message shall be sent
export const EXCHANGE = "topic_messages";
// RabbitMQ default vhost is named "/". %2F is the URL Encoded value of the Forward Slash (/).
export const VHOST = "%2F";
// RabbitMQ common queues begin with "common_"
export const COMMON_PREFIX = "common_";

// Backup and restore
// Database names
export const DB_NAMES: { [K: string]: { [K: string]: string } } = {
  [NODE_ENV_DEV]: {
    db_name_config_dev: config.development.databaseConfig.database,
    db_name_exploit_dev: config.development.databaseExploit.database,
  },
  [NODE_ENV_TEST]: {
    db_name_config_test: config.test.databaseConfig.database,
    db_name_exploit_test: config.test.databaseExploit.database,
  },
  [NODE_ENV_PROD]: {
    db_name_config_prod: config.production.databaseConfig.database,
    db_name_exploit_prod: config.production.databaseExploit.database,
  },
};

// Backup extensions and locations
export const BACKUP_LOCATIONS: { [K: string]: string } = {
  root: `${__dirname}/../../XtVisionBackup/`,
  manual: `${__dirname}/../../XtVisionBackup/Manual/`,
  scheduled: `${__dirname}/../../XtVisionBackup/Scheduled/`,
};
export const BACKUP_TYPE: { [K: string]: string } = {
  manual: "manual",
  scheduled: "scheduled",
};
export const BACKUP_EXTENSION = ".backup";
export const BEFORE_RESTORE_BACKUP_EXTENSION = "_before_restore.backup";

//masked value
export const MASKED_VALUE = "*****";
// Http Requests
export const HTTP_METHODS = {
  POST: "POST",
  PUT: "PUT",
  GET: "GET",
  DELETE: "DELETE",
  // Add other HTTP methods as needed
};

const GB = Math.pow(1024, 3); // 1 GB = 1024 MB = 1024 * 1024 KB = 1024 * 1024 * 1024 B
export const BACKUP_UPLOAD_MAX_SIZE = 2 * GB;
