import config from "../resources/config";
import { prefs, customAxios as axios } from "../../webServer";
import { Server } from "http";
import { EquipmentTypeDatabaseInterface } from "../../database/interfaces/equipmentType.database";
import { EquipmentDatabaseInterface } from "../../database/interfaces/equipment.database";
import { EquipmentTypeEquipmentPropertyDatabaseInterface } from "../../database/interfaces/equipmentTypeEquipmentProperty.database";
import {
  StateServerInterface,
  ActionTypeServerInterface,
} from "../interfaces/configEquipmentType.server";
import { logger } from "../../../logger";

export class EquipmentTypeServerService {
  constructor(protected server: Server) {}

  async getEquipmentsTypes(): Promise<EquipmentTypeDatabaseInterface[]> {
    logger.info("getEquipmentsTypes");
    return (
      await axios.get(config.xtvision.databaseUrl + "/equipmentsTypes", {
        headers: {
          Authorization: prefs.databaseAuth,
        },
      })
    ).data;
  }

  async getActionsTypesFromEquipmentTypeId(
    id: string
  ): Promise<ActionTypeServerInterface[]> {
    logger.info("getActionsTypesFromEquipmentTypeId");
    // Get ids equipments properties from equipmentTypeId
    const equipmentPropertiesIds = (
      (
        await axios.get(
          config.xtvision.databaseUrl +
            "/equipmentsTypesEquipmentsProperties?equipmentTypeId=" +
            id,
          {
            headers: {
              Authorization: prefs.databaseAuth,
            },
          }
        )
      ).data as EquipmentTypeEquipmentPropertyDatabaseInterface[]
    ).map(element => element.EquipmentPropertyId);
    // Get action types linked to ids equipments properties
    return (
      await axios.post(
        config.xtvision.databaseUrl + "/actionsTypes/equipmentsPropertiesIds",
        equipmentPropertiesIds,
        {
          headers: {
            Authorization: prefs.databaseAuth,
          },
        }
      )
    ).data;
  }

  async getStatesFromEquipmentTypeId(
    id: string
  ): Promise<StateServerInterface[]> {
    logger.info("getStatesFromEquipmentTypeId");
    // Get ids equipments properties from equipmentTypeId
    const equipmentPropertiesIds = (
      (
        await axios.get(
          config.xtvision.databaseUrl +
            "/equipmentsTypesEquipmentsProperties?equipmentTypeId=" +
            id,
          {
            headers: {
              Authorization: prefs.databaseAuth,
            },
          }
        )
      ).data as EquipmentTypeEquipmentPropertyDatabaseInterface[]
    ).map(element => element.EquipmentPropertyId);
    // Get states linked to ids equipments properties
    return (
      await axios.post(
        config.xtvision.databaseUrl + "/states/equipmentsPropertiesIds",
        equipmentPropertiesIds,
        {
          headers: {
            Authorization: prefs.databaseAuth,
          },
        }
      )
    ).data;
  }

  async getEquipmentsFromEquipmentTypeId(
    id: string
  ): Promise<EquipmentDatabaseInterface[]> {
    logger.info("getEquipmentsFromEquipmentTypeId");
    const filters = { typesIds: [Number(id)] };
    return (
      await axios.post(
        config.xtvision.databaseUrl + "/equipments/filter",
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
