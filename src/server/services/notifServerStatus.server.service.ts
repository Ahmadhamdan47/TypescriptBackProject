import { Server } from "http";
import {
  getAuthorizationStringFromSystemDb,
  getSystemFromDb,
} from "../interfaces/system.server";
import { customAxios as axios } from "../../webServer";
import { logger } from "../../../logger";

export class NotifServerStatusServerService {
  constructor(protected server: Server) {}

  /**
   * Returns a list of the currently connected equipments in a RabbitMQ server
   * As the RabbitMQ API does not provide a way to get the list of connected equipments, we use the list of connections
   * and get the equipment ID (which is also the queuename) from each connection
   * @param systemId
   * @returns
   */
  async getConnectionNames(systemId: number): Promise<string[]> {
    logger.info("getConnectionNames");
    const system = await getSystemFromDb(systemId);
    const connections = (
      await axios.get(system.url_connexion_api + "/connections", {
        headers: {
          Authorization: await getAuthorizationStringFromSystemDb(system),
        },
      })
    ).data;
    const equipments = connections.map((connection: any) => {
      return connection.equipment;
    });
    return equipments;
  }
}
