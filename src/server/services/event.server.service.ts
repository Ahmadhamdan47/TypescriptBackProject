import config from "../resources/config";
import { Server } from "http";
import { prefs, customAxios as axios } from "../../webServer";
import { EventDatabaseInterface } from "../../database/interfaces/event.database";
import { EventFilter } from "../interfaces/eventsFilter";
import { logger } from "../../../logger";

export class EventServerService {
  constructor(protected server: Server) {}

  /**
   * get all events
   */
  async getEvents(): Promise<EventDatabaseInterface[]> {
    logger.info("getEvents");
    return (
      await axios.get(config.xtvision.databaseUrl + "/events", {
        headers: {
          Authorization: prefs.databaseAuth,
        },
      })
    ).data;
  }

  /**
   * Get events by type or/and equipment and/or dates and/or equipment property
   */
  async getEventsByFilter(
    filters: EventFilter
  ): Promise<EventDatabaseInterface[]> {
    logger.info("getEventsByFilter");
    return (
      await axios.post(
        config.xtvision.databaseUrl + "/events/filter",
        filters,
        {
          headers: {
            Authorization: prefs.databaseAuth,
          },
        }
      )
    ).data;
  }
}
