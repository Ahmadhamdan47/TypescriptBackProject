import { Server } from "http";
import { EquipmentDatabaseInterface } from "../../database/interfaces/equipment.database";
import { EquipmentFilter } from "../interfaces/equipmentsFilter";
import config from "../resources/config";
import { prefs, customAxios as axios } from "../../webServer";
import { EquipmentTypeDatabaseInterface } from "../../database/interfaces/equipmentType.database";
import { EquipmentEventServerInterface } from "../interfaces/equipment.server";
import {
  CurrentEquipmentStateServerInterface,
  setAndUpdateCurrentEquipmentsStates,
} from "../interfaces/currentEquipmentState.server";
import {
  StateServerInterface,
  ActionTypeServerInterface,
} from "../interfaces/configEquipmentType.server";
import {
  getAuthorizationStringFromSystemDb,
  getSystemFromDb,
} from "../interfaces/system.server";
import { EquipmentBrandDatabaseInterface } from "../../database/interfaces/equipmentBrand.database";
import {
  PaginationQueryServerInterface,
  PaginationResultServerInterface,
  getPagination,
  getPagingDatas,
} from "../interfaces/pagination.server";
import { PaginationSequelizeDatabaseInterface } from "../../database/interfaces/pagination.database";
import { logger } from "../../../logger";

export class EquipmentServerService {
  constructor(protected server: Server) {}

  /**
   * Get all equipments
   */
  async getEquipments(
    pagination: PaginationQueryServerInterface
  ): Promise<PaginationResultServerInterface> {
    const equipmentsWithCount: PaginationSequelizeDatabaseInterface = (
      await axios.get(
        config.xtvision.databaseUrl + "/equipments" + getPagination(pagination),
        {
          headers: {
            Authorization: prefs.databaseAuth,
          },
        }
      )
    ).data;
    return getPagingDatas(equipmentsWithCount, pagination);
  }

  /**
   * Get all action types from equipment brand id
   */
  async getActionsTypesFromEquipmentBrandId(
    equipmentBrandId: any
  ): Promise<ActionTypeServerInterface[]> {
    // Get ids action types from equipment brand id
    const actionsTypesIds = (
      await axios.post(
        config.xtvision.databaseUrl + "/brandsActionsTypes/actionsTypesIds",
        [+equipmentBrandId],
        {
          headers: {
            Authorization: prefs.databaseAuth,
          },
        }
      )
    ).data as number[];
    // Get action types from action types ids
    return (
      await axios.post(
        config.xtvision.databaseUrl + "/actionsTypes/filter",
        actionsTypesIds,
        {
          headers: {
            Authorization: prefs.databaseAuth,
          },
        }
      )
    ).data;
  }

  /**
   * Get all states from equipment brand id
   */
  async getStatesFromEquipmentBrandId(
    equipmentBrandId: any
  ): Promise<StateServerInterface[]> {
    // Get states ids from equipment brand id
    const statesIds = (
      await axios.post(
        config.xtvision.databaseUrl + "/brandsStates/statesIds",
        [+equipmentBrandId],
        {
          headers: {
            Authorization: prefs.databaseAuth,
          },
        }
      )
    ).data as number[];
    // Get states from states ids
    return (
      await axios.post(
        config.xtvision.databaseUrl + "/states/filter",
        statesIds,
        {
          headers: {
            Authorization: prefs.databaseAuth,
          },
        }
      )
    ).data;
  }

  /**
   * Get equipments by filters
   */
  async getEquipmentsByFilter(
    filters: EquipmentFilter,
    pagination: PaginationQueryServerInterface
  ): Promise<PaginationResultServerInterface> {
    const equipmentsWithCount: PaginationSequelizeDatabaseInterface = (
      await axios.post(
        config.xtvision.databaseUrl +
          "/equipments/filter" +
          getPagination(pagination),
        filters,
        {
          headers: {
            Authorization: prefs.databaseAuth,
          },
        }
      )
    ).data;
    return getPagingDatas(equipmentsWithCount, pagination);
  }

  /**
   * Subscribe or unsubscribe events for equipments of systems
   */
  async subscribeToEquipmentsEvents(
    equipmentsEvents: EquipmentEventServerInterface[]
  ) {
    // Update attribute isSupervised in database
    if (equipmentsEvents.find(element => element.subscribe)) {
      await axios.put(
        config.xtvision.databaseUrl + "/xtvisionEquipmentConfigs",
        {
          equipmentsIds: equipmentsEvents
            .filter(element => element.subscribe)
            .map(raw => raw.equipmentId),
          xtvisionEquipmentConfig: { isSupervised: true },
        },
        {
          headers: {
            Authorization: prefs.databaseAuth,
          },
        }
      );
    }
    if (equipmentsEvents.find(element => !element.subscribe)) {
      await axios.put(
        config.xtvision.databaseUrl + "/xtvisionEquipmentConfigs",
        {
          equipmentsIds: equipmentsEvents
            .filter(element => !element.subscribe)
            .map(raw => raw.equipmentId),
          xtvisionEquipmentConfig: { isSupervised: false },
        },
        {
          headers: {
            Authorization: prefs.databaseAuth,
          },
        }
      );
    }
    // Fill equipmentsEvents with details (equipments, equipmentsBrands and equipmentsTypes)
    const equipments: EquipmentDatabaseInterface[] = await (
      await axios.post(
        config.xtvision.databaseUrl + "/equipments/filter",
        {
          ids: equipmentsEvents.map(raw => raw.equipmentId),
        },
        {
          headers: {
            Authorization: prefs.databaseAuth,
          },
        }
      )
    ).data;
    const equipmentsBrands: EquipmentBrandDatabaseInterface[] = await (
      await axios.post(
        config.xtvision.databaseUrl + "/equipmentsBrands/filter",
        equipments.map(raw => raw.equipmentBrandId),
        {
          headers: {
            Authorization: prefs.databaseAuth,
          },
        }
      )
    ).data;
    const equipmentsTypes: EquipmentTypeDatabaseInterface[] = await (
      await axios.post(
        config.xtvision.databaseUrl + "/equipmentsTypes/filter",
        equipmentsBrands.map(raw => raw.equipmentTypeId),
        {
          headers: {
            Authorization: prefs.databaseAuth,
          },
        }
      )
    ).data;
    for (const equipmentEvent of equipmentsEvents) {
      const equipment = equipments.find(
        equip => equip.id === equipmentEvent.equipmentId
      );
      equipmentEvent.equipmentGid = equipment?.gid;
      const equipmentBrand = equipmentsBrands.find(
        be => be.id === equipment?.equipmentBrandId
      );
      equipmentEvent.equipmentTypeId = equipmentBrand?.equipmentTypeId;
      equipmentEvent.systemId = equipmentsTypes.find(
        te => te.id === equipmentBrand?.equipmentTypeId
      )?.systemId;
    }
    for (const systemId of new Set(
      equipmentsEvents.map(equipEvent => equipEvent.systemId!)
    )) {
      // Get equipmentsEvents from the system
      const equipmentsEventsFromSystem = equipmentsEvents.filter(
        element => element.systemId === systemId
      );
      // Get system for url connexion API
      const system = await getSystemFromDb(systemId);
      const systemAuth = await getAuthorizationStringFromSystemDb(system);

      // Send equipmentsEvents to system to subscribe or unsubscribe gids to events for each equipmentType
      for (const equipmentTypeId of new Set(
        equipmentsEventsFromSystem.map(element => element.equipmentTypeId)
      )) {
        const subscribeGids = equipmentsEventsFromSystem
          .filter(
            element =>
              element.equipmentTypeId === equipmentTypeId && element.subscribe
          )
          .map(raw => raw.equipmentGid);
        const equipmentsStates = (
          await axios.post(
            system.url_connexion_api +
              "/equipmentsEvents?equipmentType=" +
              equipmentsTypes.find(te => te.id === equipmentTypeId)?.name,
            {
              subscribeGids: subscribeGids,
              unsubscribeGids: equipmentsEventsFromSystem
                .filter(
                  element =>
                    element.equipmentTypeId === equipmentTypeId &&
                    !element.subscribe
                )
                .map(raw => raw.equipmentGid),
            },
            {
              headers: {
                Authorization: systemAuth,
              },
            }
          )
        ).data as CurrentEquipmentStateServerInterface[];
        // Update new currents equipments states for equipmentsEvents subscribed
        if (equipmentsStates) {
          await setAndUpdateCurrentEquipmentsStates(
            systemAuth,
            equipmentsStates,
            equipments,
            undefined,
            undefined,
            Array.from(new Array(1), () => Number(equipmentTypeId))
          );
        }
      }
    }
  }

  /**
   * Operate an equipment to do an action in a system
   */
  async operateEquipment(
    id: string,
    actionType: string,
    paramsAction: Map<string, string>
  ) {
    // Get equipment and system info
    const equipment = (
      await axios.get(config.xtvision.databaseUrl + "/equipments/" + id, {
        headers: {
          Authorization: prefs.databaseAuth,
        },
      })
    ).data as EquipmentDatabaseInterface;
    const equipmentBrand = (
      await axios.get(
        config.xtvision.databaseUrl +
          "/equipmentsBrands/" +
          equipment.equipmentBrandId,
        {
          headers: {
            Authorization: prefs.databaseAuth,
          },
        }
      )
    ).data as EquipmentBrandDatabaseInterface;
    const equipmentType = (
      await axios.get(
        config.xtvision.databaseUrl +
          "/equipmentsTypes/" +
          equipmentBrand.equipmentTypeId,
        {
          headers: {
            Authorization: prefs.databaseAuth,
          },
        }
      )
    ).data as EquipmentTypeDatabaseInterface;
    const system = await getSystemFromDb(equipmentType.systemId);
    // Send command to equipment of system
    const systemAuth = await getAuthorizationStringFromSystemDb(system);

    await axios.post(
      system.url_connexion_api + "/equipments/" + equipment.gid,
      {
        actionType: actionType,
        params: paramsAction,
      },
      {
        headers: {
          Authorization: systemAuth,
        },
      }
    );
  }

  /**
   * Delete an equipment and its datas linked (xtvisionEquipmentConfig, currentEquipmentState) in db XTVision
   */
  async deleteEquipmentAndItsDatas(id: string) {
    logger.info("Delete equipment and its datas in db XTVision");
    await axios.delete(config.xtvision.databaseUrl + "/equipments/" + id, {
      headers: {
        Authorization: prefs.databaseAuth,
      },
    });
  }
}
