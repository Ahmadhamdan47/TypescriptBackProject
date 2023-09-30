import config from "../resources/config";
import { SystemDatabaseInterface } from "../../database/interfaces/system.database";
import { prefs, customAxios as axios } from "../../webServer";
import { AuthMode } from "./addSystem.server";
import { aesDecryptStringFromHex } from "../resources/aesUtilities.server";
import { BASE64, BASIC } from "../resources/constants";

export interface SystemServerInterface {
  release: string;
  equipmentsTypes: Array<string>;
}

export type SystemFrontServerInterface = Omit<
  SystemDatabaseInterface,
  "url_connexion_api" | "url_connexion_ws" | "password"
>;

export interface RabbitMQServerInterface {
  management_version: string;
  object_totals: ObjectTotalsRabbitMQServerInterface;

  // connected: boolean;
}

/**
 * Contains a RabbitMQ server's info
 */
interface ObjectTotalsRabbitMQServerInterface {
  channels: number;
  connections: number;
  consumers: number;
  exchanges: number;
  queues: number;
}

/**
 * Get specific system from id from database
 */
export async function getSystemFromDb(
  id: number
): Promise<SystemDatabaseInterface> {
  return (
    await axios.get(config.xtvision.databaseUrl + "/systems/" + id, {
      headers: {
        Authorization: prefs.databaseAuth,
      },
    })
  ).data;
}

/**
 * Returns the authorization string from a system using authMode, user and password
 * @param systemDb
 * @returns
 */
export async function getAuthorizationStringFromSystemDb(
  systemDb: SystemDatabaseInterface
) {
  let authorization = "";
  switch (systemDb.authMode) {
    case AuthMode.Basic:
      authorization =
        BASIC +
        Buffer.from(
          systemDb.user +
            ":" +
            (await aesDecryptStringFromHex(systemDb.password))
        ).toString(BASE64);
      break;
    default:
      break;
    // TODO others for V2
  }
  return authorization;
}

/**
 * Gets the system from database and calls getAuthorizationStringFromSystemDb
 * @param systemId
 * @returns
 */
export async function getAuthorizationStringFromSystemId(systemId: number) {
  const system = await getSystemFromDb(systemId);
  return await getAuthorizationStringFromSystemDb(system);
}
