import { Server } from "http";
import { Op } from "sequelize";
import { logger } from "../../../logger";
import { EventFilter } from "../../server/interfaces/eventsFilter";
import { NewEvent } from "../interfaces/event.database";
import { Event } from "../models/event.model";

export class EventDatabaseService {
  constructor(protected server: Server) {}

  async createOneEvent(newEvent: NewEvent): Promise<Event> {
    logger.info("createOneEvent");
    try {
      return await Event.create(newEvent);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async createEvents(newEvents: NewEvent[]): Promise<Event[]> {
    logger.info("createEvents");
    try {
      return await Event.bulkCreate(newEvents);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveAllEvents(): Promise<Event[] | null> {
    logger.info("retrieveAllEvents");
    try {
      const result = await Event.findAll();
      return result;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveOneEvent(id: string): Promise<Event | null> {
    logger.info("retrieveOneEvent");
    try {
      const result = await Event.findByPk(id);
      return result;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveEventsByFilters(filters: EventFilter): Promise<Event[] | null> {
    logger.info("retrieveEventsByFilters");
    try {
      const conditions = [];
      if (filters.stateName) {
        conditions.push({ stateName: `${filters.stateName}` });
      }
      if (filters.equipmentName) {
        conditions.push({ equipmentName: `${filters.equipmentName}` });
      }
      if (filters.equipmentProperty) {
        conditions.push({ equipmentProperty: `${filters.equipmentProperty}` });
      }
      if (filters.timestamp) {
        conditions.push({ timestamp: { [Op.gte]: `${filters.timestamp}` } });
      }
      const conditionWhere: any = {
        where: conditions,
      };
      return await Event.findAll(conditionWhere);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async deleteAllEvents(): Promise<void> {
    logger.info("deleteAllEvents");
    try {
      await Event.destroy({
        where: {},
        truncate: false,
      });
      return;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async deleteOneEvent(id: string): Promise<void> {
    logger.info("deleteOneEvent");
    try {
      await Event.destroy({
        where: {
          id,
        },
      });
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }
}
