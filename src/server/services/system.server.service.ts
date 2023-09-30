import config, { isHttpS } from "../resources/config";
import { Server } from "http";
import { prefs, customAxios as axios, credentials } from "../../webServer";
import ws from "ws";
import {
  SystemDatabaseInterface,
  NewSystem,
} from "../../database/interfaces/system.database";
import {
  EquipmentDatabaseInterface,
  NewEquipment,
} from "../../database/interfaces/equipment.database";
import {
  NewActionType,
  ActionTypeDatabaseInterface,
} from "../../database/interfaces/actionType.database";
import {
  NewEquipmentType,
  EquipmentTypeDatabaseInterface,
} from "../../database/interfaces/equipmentType.database";
import {
  NewState,
  StateDatabaseInterface,
} from "../../database/interfaces/state.database";
import {
  ParamDatabaseInterface,
  NewParam,
} from "../../database/interfaces/param.database";
import { SystemFilter } from "../interfaces/systemsFilter";
import { AddSystemServerInterface } from "../interfaces/addSystem.server";
import { EquipmentServerInterface } from "../interfaces/equipment.server";
import {
  BehaviorDatabaseInterface,
  NewBehavior,
} from "../../database/interfaces/behavior.database";
import { BehaviorBehaviorPropertyDatabaseInterface } from "../../database/interfaces/behaviorBehaviorProperty.database";
import {
  BASE64,
  BASIC,
  CASTELSUITE,
  COMMON_PREFIX,
  CONNECTED,
  DISCONNECTED,
  LINKED,
  NODE_ENV_TEST,
  RABBITMQ,
  SYNCHRONIC,
  SYSTEM,
  SYSTEM_STOPPED,
  SYSTEM_STARTED,
  UNLINKED,
  HTTPS,
  HTTP,
  WSS,
  WS,
} from "../resources/constants";
import { logger } from "../../../logger";
import {
  getAuthorizationStringFromSystemDb,
  getSystemFromDb,
  SystemFrontServerInterface,
  SystemServerInterface,
} from "../interfaces/system.server";
import {
  NewEquipmentProperty,
  EquipmentPropertyDatabaseInterface,
} from "../../database/interfaces/equipmentProperty.database";
import { EquipmentTypeEquipmentPropertyDatabaseInterface } from "../../database/interfaces/equipmentTypeEquipmentProperty.database";
import {
  ConfigEquipmentTypeServerInterface,
  ActionTypeServerInterface,
  StateServerInterface,
  EquipmentPropertyServerInterface,
} from "../interfaces/configEquipmentType.server";
import { EventSubject, Subject } from "../observers/event.server.subject";
import { EventObserver } from "../observers/event.server.observer";
import {
  BehaviorPropertyDatabaseInterface,
  NewBehaviorProperty,
} from "../../database/interfaces/behaviorProperty.database";
import {
  CurrentEquipmentStateServerInterface,
  setAndCreateCurrentEquipmentsStates,
  setAndUpdateCurrentEquipmentsStates,
} from "../interfaces/currentEquipmentState.server";
import { EventServerInterface } from "../interfaces/event.server";
import { NewBehaviorState } from "../../database/interfaces/behaviorState.database";
import { StateParamDatabaseInterface } from "../../database/interfaces/stateParam.database";
import { ActionTypeParamDatabaseInterface } from "../../database/interfaces/actionTypeParam.database";
import { DomainDatabaseInterface } from "../../database/interfaces/domain.database";
import { DomainServerInterface } from "../interfaces/domain.server";
import {
  createNotifBindingKey,
  deleteRabbitMQBinding,
  NotifServerBinding,
} from "../interfaces/notifBindingKey.server";
import {
  NewNotifBindingKey,
  SendingMode,
} from "../../database/interfaces/notifBindingKey.database";
import { aesEncryptStringToHex } from "../resources/aesUtilities.server";
import {
  EquipmentBrandDatabaseInterface,
  NewEquipmentBrand,
} from "../../database/interfaces/equipmentBrand.database";
import { BrandActionTypeDatabaseInterface } from "../../database/interfaces/brandActionType.database";
import { BrandStateDatabaseInterface } from "../../database/interfaces/brandState.database";

const mapSystems = new Map<number, ws>();
const subject: Subject = new EventSubject();

export class SystemServerService {
  constructor(protected server: Server) {
    subject.addObserver(new EventObserver(server));
  }

  /**
   * get all systems from db XtVision
   */
  async getSystems(): Promise<SystemFrontServerInterface[]> {
    logger.info("getSystems");
    return getSystemsFromDb();
  }

  /**
   * get specific system from id from db XtVision
   */
  async getSystem(id: any): Promise<SystemFrontServerInterface> {
    logger.info("getSystem");
    return getSystemFromDb(id);
  }

  /**
   * get systems in db XtVision by ...
   */
  async getSystemsByFilter(
    filters: SystemFilter
  ): Promise<SystemFrontServerInterface[]> {
    logger.info("getSystemsByFilter");
    return (
      await axios.post(
        config.xtvision.databaseUrl + "/systems/filter",
        filters,
        {
          headers: {
            Authorization: prefs.databaseAuth,
          },
        }
      )
    ).data;
  }

  /**
   * Get type equipments from system id
   */
  async getEquipmentsTypesFromSystemId(
    systemId: string
  ): Promise<EquipmentTypeDatabaseInterface[]> {
    logger.info("getEquipmentsTypesFromSystemId");
    return (
      await axios.get(
        config.xtvision.databaseUrl + "/equipmentsTypes?systemId=" + systemId,
        {
          headers: {
            Authorization: prefs.databaseAuth,
          },
        }
      )
    ).data;
  }

  /**
   * Get equipments from system id order by type
   */
  async getEquipmentsFromSystemIdOrderByType(
    systemId: string
  ): Promise<EquipmentDatabaseInterface[]> {
    logger.info("getEquipmentsFromSystemIdOrderByType");
    const filters = {
      typesIds: await getEquipmentsTypesIdsFromSystemId(systemId),
    };
    const equipments: EquipmentDatabaseInterface[] = (
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
    equipments.forEach(equip => {
      equip.systemId = +systemId;
    });
    return equipments;
  }

  /**
   * Reconnect and subscribe to system at start to get events through a WebSocket
   */
  async reconnectToSystems() {
    logger.info("reconnectToSystems");
    await reconnectToSystemsFromDb();
  }

  /**
   * Create and connect to a system thanks to its address (get all datas necessary for working, save them in database and connect to it through Websocket and/or API)
   */
  async createSystem(addSystem: AddSystemServerInterface): Promise<any> {
    logger.info("createSystem");
    let systemId = 0;
    const url = getUrlApiForSystem(
      addSystem.address,
      addSystem.brand,
      addSystem.port
    );
    const systemAuth =
      BASIC +
      Buffer.from(addSystem.user + ":" + addSystem.password).toString(BASE64);
    switch (addSystem.brand) {
      case CASTELSUITE: {
        try {
          // Get infos system and save them in DB
          const system = await getInfosCastelSuiteSystem(url, systemAuth);
          const systemDb = await saveInfosCastelSuiteInDb(system, addSystem);
          systemId = systemDb.id;
          // Get domains infos and save them in DB
          const domains = await getDomainsCastelSuiteSystem(url, systemAuth);
          const domainsDb = await saveDomainsSystemInDb(domains, systemId);
          // Once we have the system, get all equipment types managed by it and save them in DB
          const equipmentsTypes = await saveEquipmentsTypesInDb(
            setEquipmentsTypes(system.equipmentsTypes, systemId)
          );
          // Once we have the equipment types, get their brands and save them in DB
          const equipmentsBrands = await saveEquipmentsBrandsInDb(
            await getAndSetCastelSuiteEquipmentsBrands(
              url,
              systemAuth,
              equipmentsTypes
            )
          );
          // Once we have the equipment types, get their configs
          const configsTypesEquips = await getCastelSuiteEquipmentsConfigs(
            url,
            systemAuth,
            system.equipmentsTypes
          );
          // Once we have the equipment types, get all behaviors managed by it and save them in DB
          const behaviors = await saveBehaviorsInDb(
            equipmentsTypes,
            configsTypesEquips
          );
          // Once we have the equipment types, get all equipments managed by it and save them in DB
          const equipmentsToSave: NewEquipment[] = (
            await Promise.all(
              system.equipmentsTypes.map(async et =>
                createEquipmentsFromSystem(
                  await getCastelSuiteEquipments(url, systemAuth, et),
                  equipmentsBrands,
                  et,
                  behaviors,
                  domainsDb
                )
              )
            )
          ).flat();

          const equipments = await saveEquipmentsInDb(equipmentsToSave);
          // Once we have the equipment types, get all equipments properties managed by it and save/link them in DB
          const equipmentsPropertiesBehaviorsProperties =
            await linkAndSaveEquipmentPropertiesAndBehaviorsPropertiesInDb(
              configsTypesEquips,
              equipmentsTypes,
              behaviors
            );
          const equipmentsProperties =
            equipmentsPropertiesBehaviorsProperties[0];
          const behaviorsProperties =
            equipmentsPropertiesBehaviorsProperties[1];
          const configsEquipmentsProperties = configsTypesEquips
            .map(element => element.equipmentsProperties)
            .flat();
          // Once we have the equipments properties, get all action types managed by it and save/link them in DB
          const actionsTypes = await linkAndSaveActionsTypesInDb(
            configsEquipmentsProperties,
            equipmentsProperties
          );
          const configsActionsTypes = configsEquipmentsProperties
            .map(element => element.actionsTypes)
            .flat();
          // Once we have the equipments properties, get all states and behaviors states managed by it and save/link them in DB
          const states = await linkAndSaveStatesAndBehaviorsStatesInDb(
            configsEquipmentsProperties,
            equipmentsProperties,
            behaviorsProperties
          );
          const configsStates = configsEquipmentsProperties
            .map(element => element.states)
            .flat();
          // Once we have the states, action types and brands equipements, link and save them in DB
          await linkAndSaveBrandsAndActionsTypesInDb(
            configsActionsTypes,
            equipmentsBrands,
            actionsTypes
          );
          await linkAndSaveBrandsAndStatesInDb(
            configsStates,
            equipmentsBrands,
            states
          );
          // Once we have the states and action types, get all params/values managed by it and save/link them in DB
          await linkAndSaveParamsInDb(
            configsStates,
            configsActionsTypes,
            states,
            actionsTypes
          );
          // Once we have the equipments, equipments properties and states, get all currents equipments states and save them in DB
          await setAndCreateCurrentEquipmentsStates(
            systemAuth,
            await getCastelSuiteEquipmentsStates(
              url,
              systemAuth,
              system.equipmentsTypes
            ),
            equipments,
            equipmentsProperties,
            states
          );
          // TODO access control Castel Suite
          // Subscribe web socket
          await subscribeToWsSystem(systemId);
          return { id: systemId, nbEquipments: equipments.length };
        } catch (error) {
          if (systemId !== 0) {
            // If error before finishing creating all datas for the system, revert the datas saved
            await this.deleteSystemInDBAndItsDatas(systemId.toString());
          }
          throw error;
        }
      }
      case RABBITMQ: {
        // Get infos system and save them in DB
        const systemDb = await saveInfosRabbitMQInDb(
          url,
          addSystem,
          systemAuth
        );
        await getAndSaveConfigRabbitMQSystem(systemDb, systemAuth);
        return { id: systemDb.id, nbEquipments: 0 };
      }
      case SYNCHRONIC:
        // TODO Synchronic
        break;
      default:
        break;
    }
  }

  /**
   * Delete a system and all its datas linked (and close the connection)
   */
  async deleteSystemInDBAndItsDatas(systemId: string) {
    logger.info("deleteSystemInDBAndItsDatas");
    await deleteSystemInDB(systemId);
    // Close and delete system web socket
    mapSystems.get(+systemId)?.close(4000);
    mapSystems.delete(+systemId);
  }

  /**
   * Delete all systems and all their datas linked (and close the connections)
   */
  async deleteSystemsInDBAndTheirDatas() {
    logger.info("deleteSystemsInDBAndTheirDatas");
    await deleteSystemsInDB();
    // Close and delete systems webs sockets
    mapSystems.forEach((_, systemId) => {
      mapSystems.get(systemId)?.close(4000);
      mapSystems.delete(systemId);
    });
  }

  // Update a system
  async updateSystem(systemId: string, attributesToUpdate: any) {
    logger.info("updateSystem");
    return await updateSystemInDb(+systemId, attributesToUpdate);
  }
}

/**
 * Delete a system in database
 */
async function deleteSystemInDB(systemId: string) {
  logger.info("deleteSystemInDB");
  await axios.delete(config.xtvision.databaseUrl + "/systems/" + systemId, {
    headers: {
      Authorization: prefs.databaseAuth,
    },
  });
}

/**
 * Delete all systems in database
 */
async function deleteSystemsInDB() {
  logger.info("deleteSystemsInDB");
  await axios.delete(config.xtvision.databaseUrl + "/systems", {
    headers: {
      Authorization: prefs.databaseAuth,
    },
  });
}

/**
 * Update a system in database
 */
async function updateSystemInDb(systemId: number, attributesToUpdate: any) {
  logger.info("updateSystemInDb");
  // Updating port and/or address implies url_connexion_... needs to be updated too
  if (attributesToUpdate.address || attributesToUpdate.port) {
    const systemToUpdate = await getSystemFromDb(systemId);
    if (attributesToUpdate.address && attributesToUpdate.port) {
      systemToUpdate.address = attributesToUpdate.address;
      systemToUpdate.port = attributesToUpdate.port;
    } else if (attributesToUpdate.address) {
      systemToUpdate.address = attributesToUpdate.address;
    } else if (attributesToUpdate.port) {
      systemToUpdate.port = attributesToUpdate.port;
    }
    attributesToUpdate.url_connexion_api = getUrlApiForSystem(
      systemToUpdate.address,
      systemToUpdate.brand,
      systemToUpdate.port
    );
    attributesToUpdate.url_connexion_ws = getUrlWsForSystem(
      systemToUpdate.address,
      systemToUpdate.brand,
      systemToUpdate.port
    );
    // Update system datas in database
    await axios.put(
      config.xtvision.databaseUrl + "/systems/" + systemId,
      attributesToUpdate,
      {
        headers: {
          Authorization: prefs.databaseAuth,
        },
      }
    );
    // Close old websocket link with old url (which informs Front and reconnects/resynchronises with new URL)
    mapSystems.get(+systemId)?.close();
  } else {
    // Update system datas in database
    await axios.put(
      config.xtvision.databaseUrl + "/systems/" + systemId,
      attributesToUpdate,
      {
        headers: {
          Authorization: prefs.databaseAuth,
        },
      }
    );
  }
}

/**
 * Get url API to call system
 */
function getUrlApiForSystem(
  address: string,
  brand: string,
  port?: string
): any {
  // If user doesn't write http(s) prefix
  if (isHttpS && !address.includes(HTTPS)) {
    address = HTTPS + address;
  } else if (!isHttpS && !address.includes(HTTP)) {
    address = HTTP + address;
  }
  switch (brand) {
    case CASTELSUITE:
      if (port) {
        return `${address}:${port}/CASTELSuite/xtvision`;
      } else {
        return `${address}/CASTELSuite/xtvision`;
      }
    case SYNCHRONIC:
      // TODO Synchronic
      break;
    case RABBITMQ:
      if (port) {
        return `${address}:${port}/api`;
      } else {
        return `${address}/api`;
      }
    default:
      return "";
  }
}

/**
 * Get url WS to connect to system
 */
function getUrlWsForSystem(
  address: string,
  brand: string,
  port?: string
): string {
  // Put ws(s) prefix
  if (isHttpS) {
    if (address.includes(HTTPS)) {
      address = address.replace(HTTPS, WSS);
    } else {
      address = WSS + address;
    }
  } else {
    if (address.includes(HTTP)) {
      address = address.replace(HTTP, WS);
    } else {
      address = WS + address;
    }
  }
  switch (brand) {
    case CASTELSUITE: {
      if (port) {
        return `${address}:${port}/CASTELSuite/ws/xtvision_event`;
      } else {
        return `${address}/CASTELSuite/ws/xtvision_event`;
      }
    }
    case SYNCHRONIC:
      // TODO Synchronic
      return "";
    case RABBITMQ:
      return "";
    default:
      return "";
  }
}

/**
 * Get behavior name from type equipment
 */
function getBehaviorNameFromEquipmentType(name: string): string {
  return `Default ${name} behavior`;
}

/**
 * Create equipments database from infos equipments system (one to many)
 */
function createEquipmentsFromSystem(
  equipments: EquipmentServerInterface[],
  equipmentsBrands: EquipmentBrandDatabaseInterface[],
  typeEquip: string,
  behaviors: BehaviorDatabaseInterface[],
  domains: DomainDatabaseInterface[]
): NewEquipment[] {
  return equipments.map(equipment => ({
    gid: equipment.audioVideoGid,
    name: equipment.name,
    ipAddress: equipment.ipAddress,
    brand: equipment.type,
    label: equipment.label,
    release: equipment.release,
    camera: equipment.camera,
    status: LINKED, // Always LINKED because equipments come from the system
    equipmentBrandId: equipmentsBrands.find(
      brand => equipment.type === brand.name
    )!.id,
    behaviorId: behaviors.find(
      behavior => getBehaviorNameFromEquipmentType(typeEquip) === behavior.name
    )!.id,
    domainId: domains.find(
      domain => domain.domainSystemId === equipment.domainId
    )!.id,
    canReceiveTextMessage: equipment.canReceiveTextMessage,
  }));
}

/**
 * Set attributes to equipment types (one to many)
 */
function setEquipmentsTypes(
  equipmentsTypes: string[],
  systemId: number
): NewEquipmentType[] {
  return equipmentsTypes.map(equipmentType => ({
    name: equipmentType,
    systemId,
  }));
}

const reconnectToSystem: {
  [K: string]: (system: SystemDatabaseInterface) => Promise<void>;
} = {
  [CASTELSUITE]: reconnectToCastelSuiteSystem, // TODO Synchronic
};

/**
 * Reconnect and subscribe to systems from database to get events through a WebSocket
 */
export async function reconnectToSystemsFromDb(
  systems?: SystemDatabaseInterface[]
) {
  logger.info("reconnectToSystemsFromDb");
  await Promise.all(
    (systems ?? (await getSystemsFromDb())).map(async system => {
      if (reconnectToSystem[system.brand])
        await reconnectToSystem[system.brand](system);
    })
  );
}

/**
 * After connection loss with CastelSuite system, reconnect and update XtVision in order to have consistents datas
 * - Get general infos from system and update them
 * - Compare equipments between XtVision and CastelSuite and link/unlik new or old equipments
 * - Update all currents equipments states for each property and each equipment
 * - Subscribe and unsubscribe equipmentsEvents to get events from equipments supervised through the Web Socket
 * - Start Web Socket between XtVision and CastelSuite to receive events
 */
async function reconnectToCastelSuiteSystem(system: SystemDatabaseInterface) {
  logger.info("reconnectToCastelSuiteSystem");
  try {
    // TODO dev comments from #17658
    const systemAuth = await getAuthorizationStringFromSystemDb(system);
    // Get and update systems infos
    const infosSystem = await getInfosCastelSuiteSystem(
      system.url_connexion_api,
      systemAuth
    );
    await updateSystemInDb(system.id, {
      release: infosSystem.release,
    });
    // Get equipmentsTypes, equipmentsBrands and domains for processings
    const equipmentsTypes = (
      await axios.get(
        config.xtvision.databaseUrl + "/equipmentsTypes?systemId=" + system.id,
        {
          headers: {
            Authorization: prefs.databaseAuth,
          },
        }
      )
    ).data as EquipmentTypeDatabaseInterface[];
    const equipmentsBrands = (
      await axios.get(
        config.xtvision.databaseUrl + "/equipmentsBrands?systemId=" + system.id,
        {
          headers: {
            Authorization: prefs.databaseAuth,
          },
        }
      )
    ).data as EquipmentBrandDatabaseInterface[];
    const domains = (
      await axios.get(
        config.xtvision.databaseUrl + "/domains?systemId=" + system.id,
        {
          headers: {
            Authorization: prefs.databaseAuth,
          },
        }
      )
    ).data as DomainDatabaseInterface[];
    // Link or unlink new or old equipments
    const equipments = await updateOldNewEquipmentsFromSystemAndFromDb(
      system,
      equipmentsTypes,
      equipmentsBrands,
      domains,
      systemAuth
    );
    // Update all currents equipments states for all equipments and for all properties equipments
    await setAndUpdateCurrentEquipmentsStates(
      systemAuth,
      await getCastelSuiteEquipmentsStates(
        system.url_connexion_api,
        systemAuth,
        equipmentsTypes.map(te => te.name)
      ),
      equipments,
      undefined,
      undefined,
      equipmentsTypes.map(te => te.id)
    );
    // Send equipmentsEvents to system to subscribe or unsubscribe gids to events for each equipmentType
    await subscribeToEventsEquipments(
      equipmentsTypes,
      equipmentsBrands,
      equipments,
      system
    );
    // WebSocket connection to get live events
    await subscribeToWsSystem(system.id);
  } catch (error) {
    logger.error(error);
    // Don't execute for unit tests because it's an infinite process
    if (process.env.NODE_ENV !== NODE_ENV_TEST) {
      // Loop to try to reconnect to CS automatically because it is down or it has stopped
      await new Promise(resolve => setTimeout(resolve, 15000));
      await reconnectToCastelSuiteSystem(system);
    }
  }
}

/**
 * Send equipmentsEvents to system to subscribe or unsubscribe gids to events for each equipmentType
 */
async function subscribeToEventsEquipments(
  equipmentsTypes: EquipmentTypeDatabaseInterface[],
  equipmentsBrands: EquipmentBrandDatabaseInterface[],
  equipments: EquipmentDatabaseInterface[],
  system: SystemDatabaseInterface
) {
  logger.info("subscribeToEventsEquipments");
  for (const equipmentType of equipmentsTypes) {
    const brandsIds = equipmentsBrands.reduce((acc, cur) => {
      if (cur.equipmentTypeId === equipmentType.id) {
        acc.push(cur.id);
      }
      return acc;
    }, [] as number[]);

    await axios.post(
      system.url_connexion_api +
        "/equipmentsEvents?equipmentType=" +
        equipmentType.name,
      {
        subscribeGids: equipments.reduce((acc, cur) => {
          if (
            brandsIds.includes(cur.equipmentBrandId) &&
            cur.XtvisionEquipmentConfig.isSupervised
          ) {
            acc.push(cur.gid);
          }
          return acc;
        }, [] as number[]),
        unsubscribeGids: equipments.reduce((acc, cur) => {
          if (
            brandsIds.includes(cur.equipmentBrandId) &&
            !cur.XtvisionEquipmentConfig.isSupervised
          ) {
            acc.push(cur.gid);
          }
          return acc;
        }, [] as number[]),
      },
      {
        headers: {
          Authorization: await getAuthorizationStringFromSystemDb(system),
        },
      }
    );
  }
}

/**
 *  Compare equipments from system and equipments from database for each equipmentType (name, gid and ipAddress for uniqueness)
 *  Link or unlink them if the lists are not the same
 */
async function updateOldNewEquipmentsFromSystemAndFromDb(
  system: SystemDatabaseInterface,
  equipmentsTypes: EquipmentTypeDatabaseInterface[],
  equipmentsBrands: EquipmentBrandDatabaseInterface[],
  domains: DomainDatabaseInterface[],
  systemAuth: string
): Promise<EquipmentDatabaseInterface[]> {
  logger.info("updateOldNewEquipmentsFromSystemAndFromDb");
  // Get existing equipments from database
  let equipmentsFromDb = (
    await axios.get(
      config.xtvision.databaseUrl +
        "/equipments?systemId=" +
        system.id +
        "&status=" +
        LINKED,
      {
        headers: {
          Authorization: prefs.databaseAuth,
        },
      }
    )
  ).data as EquipmentDatabaseInterface[];
  const equipIdsToUnlink: number[] = [];
  const equipsToLink: NewEquipment[] = [];
  // For each equipment type, compare to link or unlink equipments for this type equipment
  for (const equipmentsType of equipmentsTypes) {
    const brandsIds = equipmentsBrands.reduce((acc, cur) => {
      if (cur.equipmentTypeId === equipmentsType.id) {
        acc.push(cur.id);
      }
      return acc;
    }, [] as number[]);
    // Get equipments from system
    const equipmentsFromSystem = await getCastelSuiteEquipments(
      system.url_connexion_api,
      systemAuth,
      equipmentsType.name
    );
    // Compare lists equipments and set an array of "UNLINKED" equipment if doesn't exist anymore
    equipmentsFromDb
      .filter(efdb => brandsIds.includes(efdb.equipmentBrandId))
      .forEach(equipFromDb => {
        if (
          equipmentsFromSystem.filter(
            equipFromSystem =>
              equipFromDb.name === equipFromSystem.name &&
              equipFromDb.gid === equipFromSystem.audioVideoGid &&
              equipFromDb.ipAddress === equipFromSystem.ipAddress
          ).length === 0
        ) {
          equipIdsToUnlink.push(equipFromDb.id);
        }
      });
    // Get the default behavior for this type equipment (needs later to save linked equipments)
    const behavior = (
      await axios.get(
        config.xtvision.databaseUrl +
          "/behaviors/filterOne?equipmentTypeId=" +
          equipmentsType.id,
        {
          headers: {
            Authorization: prefs.databaseAuth,
          },
        }
      )
    ).data as BehaviorDatabaseInterface;
    // Compare lists equipments and set an array of "LINKED" equipment if new
    equipmentsFromSystem.forEach(equipFromSystem => {
      if (
        equipmentsFromDb.filter(
          equipFromDb =>
            equipFromDb.name === equipFromSystem.name &&
            equipFromDb.gid === equipFromSystem.audioVideoGid &&
            equipFromDb.ipAddress === equipFromSystem.ipAddress
        ).length === 0
      ) {
        equipsToLink.push({
          gid: equipFromSystem.audioVideoGid,
          name: equipFromSystem.name,
          label: equipFromSystem.label,
          ipAddress: equipFromSystem.ipAddress,
          release: equipFromSystem.release,
          camera: equipFromSystem.camera,
          status: LINKED,
          equipmentBrandId: equipmentsBrands.find(
            be => be.name === equipFromSystem.type
          )!.id,
          behaviorId: behavior.id,
          domainId: domains.find(
            domain => equipFromSystem.domainId === domain.domainSystemId
          )!.id,
          canReceiveTextMessage: equipFromSystem.canReceiveTextMessage,
        });
      }
    });
  }
  // Update UNLINKED, save LINKED equipments and update equipmentsFromDb list
  if (equipIdsToUnlink && equipIdsToUnlink.length !== 0) {
    await axios.put(
      config.xtvision.databaseUrl + "/equipments",
      { equipment: { status: UNLINKED }, equipmentsIds: equipIdsToUnlink },
      {
        headers: {
          Authorization: prefs.databaseAuth,
        },
      }
    );
    equipIdsToUnlink.forEach(idToUnlink => {
      equipmentsFromDb = equipmentsFromDb.filter(
        equip => equip.id !== idToUnlink
      );
    });
  }
  if (equipsToLink.length) {
    equipmentsFromDb = [
      ...equipmentsFromDb,
      ...((
        await axios.post(
          config.xtvision.databaseUrl + "/equipments",
          equipsToLink,
          {
            headers: {
              Authorization: prefs.databaseAuth,
            },
          }
        )
      ).data as EquipmentDatabaseInterface[]),
    ];
  }
  return equipmentsFromDb;
}

/**
 * Get ids equipment types from system id
 */
async function getEquipmentsTypesIdsFromSystemId(
  systemId: string
): Promise<number[]> {
  logger.info("getEquipmentsTypesIdsFromSystemId");
  return (
    await axios.get(
      config.xtvision.databaseUrl + "/equipmentsTypes/ids?systemId=" + systemId,
      {
        headers: {
          Authorization: prefs.databaseAuth,
        },
      }
    )
  ).data;
}

/**
 * Get systems from database
 */
async function getSystemsFromDb(): Promise<SystemDatabaseInterface[]> {
  logger.info("getSystemsFromDb");
  return (
    await axios.get(config.xtvision.databaseUrl + "/systems", {
      headers: {
        Authorization: prefs.databaseAuth,
      },
    })
  ).data;
}

/**
 * Get Castel Suite system infos
 */
async function getInfosCastelSuiteSystem(
  url: string,
  systemAuth: string
): Promise<SystemServerInterface> {
  logger.info("getInfosCastelSuiteSystem");
  return (
    await axios.get(url + "/whoareyou", {
      headers: {
        Authorization: systemAuth,
      },
    })
  ).data;
}

/**
 * Get Castel Suite system domains for equipments
 */
async function getDomainsCastelSuiteSystem(
  url: string,
  systemAuth: string
): Promise<DomainServerInterface[]> {
  logger.info("getDomainsCastelSuiteSystem");
  return (
    await axios.get(url + "/domains", {
      headers: {
        Authorization: systemAuth,
      },
    })
  ).data;
}

/**
 * gets a RabbitMQ's system config and saves it to xtvision db
 * @param systemId
 * @param url_api
 */
async function getAndSaveConfigRabbitMQSystem(
  systemDb: SystemDatabaseInterface,
  systemAuth: string
) {
  logger.info("getAndSaveConfigRabbitMQSystem");
  const systemId = systemDb.id;
  const url_api = systemDb.url_connexion_api;
  const bindings: { [properties_key: string]: string[] } = {};
  // get and filter bindings from RabbitMQ server
  (
    await axios.get(url_api + "/bindings/%2F", {
      headers: {
        Authorization: systemAuth,
      },
    })
  ).data.forEach((binding: NotifServerBinding) => {
    if (binding.sender === "topic_messages") {
      // If key doesn't exist, add it, then push binding.destination in it
      bindings[binding.properties_key] = bindings[binding.properties_key] || [];
      bindings[binding.properties_key].push(binding.destination);
    }
  });

  // get xtvision equipments ids
  const equipmentIds: number[] = (
    await axios.get(config.xtvision.databaseUrl + "/equipments", {
      headers: {
        Authorization: prefs.databaseAuth,
      },
    })
  ).data.map((equipment: EquipmentDatabaseInterface) => equipment.id);

  // create binding keys with the equipments found in xtvision db
  for (const key in bindings) {
    const bindingsEquipmentsIds = bindings[key].map(value => Number(value));
    const intersection = bindingsEquipmentsIds.filter(element =>
      equipmentIds.includes(element)
    );
    const remain = bindingsEquipmentsIds.filter(
      element => !equipmentIds.includes(element)
    );
    if (key.includes(COMMON_PREFIX)) {
      const bindingKey: NewNotifBindingKey = {
        defaultMessageTtl: 0,
        name: key,
        sendingMode: SendingMode.Common,
        systemId: systemId,
      };
      await createNotifBindingKey(bindingKey, intersection);
    } else {
      const bindingKey: NewNotifBindingKey = {
        defaultMessageTtl: 0,
        name: key,
        sendingMode: SendingMode.Unique,
        systemId: systemId,
      };
      await createNotifBindingKey(bindingKey, intersection);
    }

    // delete bindings from queues non present in xtvision db
    for (const queueName of remain) {
      // queues that include "common" are common queues, they work differently and their bindings shall not be deleted
      if (!key.includes(COMMON_PREFIX)) {
        await deleteRabbitMQBinding(
          systemId,
          url_api,
          queueName.toString(),
          key
        );
      }
    }
  }
}

/**
 * Save infos system in database
 */
async function saveInfosCastelSuiteInDb(
  system: SystemServerInterface,
  addSystem: AddSystemServerInterface
): Promise<SystemDatabaseInterface> {
  logger.info("saveInfosCastelSuiteInDb");
  const encryptedPwd = await aesEncryptStringToHex(addSystem.password);

  const systemToSave: NewSystem = {
    name: addSystem.name,
    kind: addSystem.kind,
    address: addSystem.address,
    port: addSystem.port,
    url_connexion_api: getUrlApiForSystem(
      addSystem.address,
      addSystem.brand,
      addSystem.port
    ),
    url_connexion_ws: getUrlWsForSystem(
      addSystem.address,
      addSystem.brand,
      addSystem.port
    ),
    release: system.release,
    state: CONNECTED,
    brand: addSystem.brand,
    createdBy: addSystem.createdBy,
    updatedBy: addSystem.createdBy,
    authMode: addSystem.authMode,
    user: addSystem.user,
    password: encryptedPwd,
  };
  // TODO save in database (from addSystem) managementArea, category and kind and manage processings for them
  return (
    await axios.post(config.xtvision.databaseUrl + "/systems", systemToSave, {
      headers: {
        Authorization: prefs.databaseAuth,
      },
    })
  ).data;
}

async function saveDomainsSystemInDb(
  domains: DomainServerInterface[],
  systemId: number
): Promise<DomainDatabaseInterface[]> {
  logger.info("saveDomainsSystemInDb");
  const domainsToSave = domains.map(domain => ({
    name: domain.name,
    domainSystemId: domain.id,
    parentDomainSystemId: domain.parentId,
    systemId: systemId,
  }));

  return (
    await axios.post(config.xtvision.databaseUrl + "/domains", domainsToSave, {
      headers: {
        Authorization: prefs.databaseAuth,
      },
    })
  ).data;
}

async function saveInfosRabbitMQInDb(
  url: string,
  addSystem: AddSystemServerInterface,
  systemAuth: string
): Promise<SystemDatabaseInterface> {
  logger.info("saveInfosRabbitMQInDb");
  const system = (
    await axios.get(url + "/overview", {
      headers: {
        Authorization: systemAuth,
      },
    })
  ).data;
  const encryptedPwd = await aesEncryptStringToHex(addSystem.password);

  const systemToSave: NewSystem = {
    name: addSystem.name,
    kind: addSystem.kind,
    brand: addSystem.brand,
    address: addSystem.address,
    port: addSystem.port,
    release: system.management_version,
    url_connexion_api: getUrlApiForSystem(
      addSystem.address,
      addSystem.brand,
      addSystem.port
    ),
    url_connexion_ws: "",
    state: CONNECTED,
    createdBy: addSystem.createdBy,
    updatedBy: addSystem.createdBy,
    authMode: addSystem.authMode,
    user: addSystem.user,
    password: encryptedPwd,
  };
  return (
    await axios.post(config.xtvision.databaseUrl + "/systems", systemToSave, {
      headers: {
        Authorization: prefs.databaseAuth,
      },
    })
  ).data;
}

/**
 * Get Castel Suite equipments from a type equipment
 */
async function getCastelSuiteEquipments(
  url: string,
  systemAuth: string,
  equipmentType: string
): Promise<EquipmentServerInterface[]> {
  logger.info("getCastelSuiteEquipments");
  return (
    await axios.get(
      url + "/equipmentTypes/list?equipmentType=" + equipmentType,
      {
        headers: {
          Authorization: systemAuth,
        },
      }
    )
  ).data;
}

/**
 * Get Castel Suite configs equipments from equipment types
 */
async function getCastelSuiteEquipmentsConfigs(
  url: string,
  systemAuth: string,
  equipmentsTypes: string[]
): Promise<ConfigEquipmentTypeServerInterface[]> {
  logger.info("getCastelSuiteEquipmentsConfigs");
  return await Promise.all(
    equipmentsTypes.map(
      async et =>
        (
          await axios.get(url + "/equipmentTypes/config?equipmentType=" + et, {
            headers: {
              Authorization: systemAuth,
            },
          })
        ).data
    )
  );
}

/**
 * Get Castel Suite equipments currents states from equipment types
 */
async function getCastelSuiteEquipmentsStates(
  url: string,
  systemAuth: string,
  equipmentsTypes: string[]
): Promise<CurrentEquipmentStateServerInterface[]> {
  logger.info("getCastelSuiteEquipmentsStates");
  const equipmentsStates = (
    await Promise.all(
      equipmentsTypes.map(
        async equipmentsType =>
          (
            await axios.get(
              url + "/equipmentTypes/states?equipmentType=" + equipmentsType,
              {
                headers: {
                  Authorization: systemAuth,
                },
              }
            )
          ).data as CurrentEquipmentStateServerInterface[]
      )
    )
  ).flat();
  return equipmentsStates;
}

/**
 * Get Castel Suite equipments brands from equipment types
 */
async function getAndSetCastelSuiteEquipmentsBrands(
  url: string,
  systemAuth: string,
  equipmentsTypes: EquipmentTypeDatabaseInterface[]
): Promise<NewEquipmentBrand[]> {
  logger.info("getAndSetCastelSuiteEquipmentsBrands");
  const equipmentsBrands = (
    await Promise.all(
      equipmentsTypes.map(async equipmentsType =>
        (
          (
            await axios.get(
              url +
                "/equipmentTypes/brands?equipmentType=" +
                equipmentsType.name,
              {
                headers: {
                  Authorization: systemAuth,
                },
              }
            )
          ).data as string[]
        ).map(
          brand =>
            ({
              name: brand,
              equipmentTypeId: equipmentsType.id,
            } as NewEquipmentBrand)
        )
      )
    )
  ).flat();
  return equipmentsBrands;
}

/**
 * Save equipments from a system in database
 */
async function saveEquipmentsInDb(
  equipments: NewEquipment[]
): Promise<EquipmentDatabaseInterface[]> {
  logger.info("saveEquipmentsInDb");
  return (
    await axios.post(config.xtvision.databaseUrl + "/equipments", equipments, {
      headers: {
        Authorization: prefs.databaseAuth,
      },
    })
  ).data;
}

/**
 * Save equipment types from a system in database
 */
async function saveEquipmentsTypesInDb(
  equipmentsTypes: NewEquipmentType[]
): Promise<EquipmentTypeDatabaseInterface[]> {
  logger.info("saveEquipmentsTypesInDb");
  return (
    await axios.post(
      config.xtvision.databaseUrl + "/equipmentsTypes",
      equipmentsTypes,
      {
        headers: {
          Authorization: prefs.databaseAuth,
        },
      }
    )
  ).data;
}

/**
 * Save behaviors from a system in database
 */
async function saveBehaviorsInDb(
  equipmentsTypes: EquipmentTypeDatabaseInterface[],
  configsEquipmentTypes: ConfigEquipmentTypeServerInterface[]
): Promise<BehaviorDatabaseInterface[]> {
  logger.info("saveBehaviorsInDb");
  const behaviors: NewBehavior[] = equipmentsTypes.map(equipmentsType => ({
    name: getBehaviorNameFromEquipmentType(equipmentsType.name),
    icon: configsEquipmentTypes.find(
      confEquipType => confEquipType.entityName === equipmentsType.name
    )!.entityIcon,
    isDefault: true, // By default because comes from the system
    equipmentTypeId: equipmentsType.id,
  }));
  return (
    await axios.post(config.xtvision.databaseUrl + "/behaviors", behaviors, {
      headers: {
        Authorization: prefs.databaseAuth,
      },
    })
  ).data;
}

/**
 * Get all equipments properties managed by equipment types and save/link them in DB
 */
async function linkAndSaveEquipmentPropertiesAndBehaviorsPropertiesInDb(
  configsEquipmentTypes: ConfigEquipmentTypeServerInterface[],
  equipmentsTypes: EquipmentTypeDatabaseInterface[],
  behaviors: BehaviorDatabaseInterface[]
): Promise<any[][]> {
  logger.info("linkAndSaveEquipmentPropertiesAndBehaviorsPropertiesInDb");
  const equipmentsPropertiesToSave: NewEquipmentProperty[] = [];
  // Set equipments properties to save from JSON
  configsEquipmentTypes.forEach(confEquipType => {
    confEquipType.equipmentsProperties.forEach(equipmentProperty => {
      if (
        !equipmentsPropertiesToSave.find(
          element => element.name === equipmentProperty.name
        )
      ) {
        equipmentsPropertiesToSave.push({
          name: equipmentProperty.name,
        });
      }
    });
  });
  // Save equipments properties in DB
  const equipmentsPropertiesToReturn: EquipmentPropertyDatabaseInterface[] = (
    await axios.post(
      config.xtvision.databaseUrl + "/equipmentsProperties",
      equipmentsPropertiesToSave,
      {
        headers: {
          Authorization: prefs.databaseAuth,
        },
      }
    )
  ).data;
  // Set behaviors properties to save from equipments properties
  const behaviorsPropertiesToSave: NewBehaviorProperty[] =
    equipmentsPropertiesToReturn.map(equipmentProperty => ({
      equipmentPropertyId: equipmentProperty.id,
      name: equipmentProperty.name,
    }));
  // Save equipments properties in DB
  const behaviorsPropertiesToReturn: BehaviorPropertyDatabaseInterface[] = (
    await axios.post(
      config.xtvision.databaseUrl + "/behaviorsProperties",
      behaviorsPropertiesToSave,
      {
        headers: {
          Authorization: prefs.databaseAuth,
        },
      }
    )
  ).data;
  // Link equipment types and equipments properties / Link behaviors and behaviors properties
  const equipmentsTypesEquipmentsProperties: EquipmentTypeEquipmentPropertyDatabaseInterface[] =
    [];
  const behaviorsBehaviorsProperties: BehaviorBehaviorPropertyDatabaseInterface[] =
    [];
  configsEquipmentTypes.forEach(confEquipType => {
    confEquipType.equipmentsProperties.forEach(ep => {
      const equipmentTypeId = equipmentsTypes.find(
        equipmentType => equipmentType.name === confEquipType.entityName
      )!.id;
      const equipmentPropertyId = equipmentsPropertiesToReturn.find(
        element => element.name === ep.name
      )!.id;
      const behaviorId = behaviors.find(
        behavior =>
          behavior.name ===
          getBehaviorNameFromEquipmentType(confEquipType.entityName)
      )!.id;
      const behaviorPropertyId = behaviorsPropertiesToReturn.find(
        element => element.name === ep.name
      )!.id;
      if (
        !equipmentsTypesEquipmentsProperties.find(
          teep =>
            teep.EquipmentTypeId === equipmentTypeId &&
            teep.EquipmentPropertyId === equipmentPropertyId
        )
      ) {
        equipmentsTypesEquipmentsProperties.push({
          EquipmentTypeId: equipmentTypeId,
          EquipmentPropertyId: equipmentPropertyId,
        });
      }
      if (
        !behaviorsBehaviorsProperties.find(
          bbv =>
            bbv.BehaviorId === behaviorId &&
            bbv.BehaviorPropertyId === behaviorPropertyId
        )
      ) {
        behaviorsBehaviorsProperties.push({
          BehaviorId: behaviorId,
          BehaviorPropertyId: behaviorPropertyId,
        });
      }
    });
  });
  // Save equipment types and equipments properties linked
  await axios.post(
    config.xtvision.databaseUrl + "/equipmentsTypesEquipmentsProperties",
    equipmentsTypesEquipmentsProperties,
    {
      headers: {
        Authorization: prefs.databaseAuth,
      },
    }
  );
  // Save behaviors and behaviors properties linked
  await axios.post(
    config.xtvision.databaseUrl + "/behaviorsBehaviorsProperties",
    behaviorsBehaviorsProperties,
    {
      headers: {
        Authorization: prefs.databaseAuth,
      },
    }
  );
  return [equipmentsPropertiesToReturn, behaviorsPropertiesToReturn];
}

/**
 * Get all action types managed by equipments properties and save/link them in DB
 */
async function linkAndSaveActionsTypesInDb(
  configEquipmentsProperties: EquipmentPropertyServerInterface[],
  equipmentsProperties: EquipmentPropertyDatabaseInterface[]
): Promise<ActionTypeDatabaseInterface[]> {
  logger.info("linkAndSaveActionsTypesInDb");
  const actionsTypesToSave: NewActionType[] = [];
  // Set action types to save from JSON
  configEquipmentsProperties.forEach(cv => {
    const rquipmentPropertyId = equipmentsProperties.find(
      equipmentProperty => equipmentProperty.name === cv.name
    )!.id;
    cv.actionsTypes.forEach(actionType => {
      if (
        !actionsTypesToSave.find(
          ta =>
            ta.name === actionType.name &&
            ta.equipmentPropertyId === rquipmentPropertyId
        )
      ) {
        actionsTypesToSave.push({
          name: actionType.name,
          equipmentPropertyId: rquipmentPropertyId,
        });
      }
    });
  });
  // Save action types in DB
  const actionsTypesToReturn: ActionTypeDatabaseInterface[] = (
    await axios.post(
      config.xtvision.databaseUrl + "/actionsTypes",
      actionsTypesToSave,
      {
        headers: {
          Authorization: prefs.databaseAuth,
        },
      }
    )
  ).data;
  return actionsTypesToReturn;
}

/**
 * Get all states managed by equipments properties and save/link them in DB
 */
async function linkAndSaveStatesAndBehaviorsStatesInDb(
  configEquipmentsProperties: EquipmentPropertyServerInterface[],
  equipmentsProperties: EquipmentPropertyDatabaseInterface[],
  behaviorsProperties: BehaviorPropertyDatabaseInterface[]
): Promise<StateDatabaseInterface[]> {
  logger.info("linkAndSaveStatesAndBehaviorsStatesInDb");
  const typesStatesToSave: NewState[] = [];
  // Set states to save from JSON
  configEquipmentsProperties.forEach(cv => {
    const equipmentPropertyId = equipmentsProperties.find(
      equipmentProperty => equipmentProperty.name === cv.name
    )!.id;
    cv.states.forEach(state => {
      if (
        !typesStatesToSave.find(
          ts =>
            ts.name === state.name &&
            ts.equipmentPropertyId === equipmentPropertyId
        )
      ) {
        typesStatesToSave.push({
          name: state.name,
          equipmentPropertyId: equipmentPropertyId,
        });
      }
    });
  });
  // Save states in DB
  const statesTypesToReturn: StateDatabaseInterface[] = (
    await axios.post(
      config.xtvision.databaseUrl + "/states",
      typesStatesToSave,
      {
        headers: {
          Authorization: prefs.databaseAuth,
        },
      }
    )
  ).data;
  // Link states and equipments properties / set behaviors states to save from JSON
  const behaviorsStates: NewBehaviorState[] = [];
  configEquipmentsProperties.forEach(config => {
    config.states.forEach(state => {
      const stateId = statesTypesToReturn.find(
        stateType => stateType.name === state.name
      )!.id;
      const behaviorPropertyId = behaviorsProperties.find(
        element => element.name === config.name
      )!.id;
      if (!behaviorsStates.find(bs => bs.stateId === stateId)) {
        behaviorsStates.push({
          stateId: stateId,
          name: state.name,
          icon: state.icon,
          isFault: state.gravity >= 2,
          isAlarm: state.gravity >= 3,
          mustBeArchived: true,
          behaviorPropertyId: behaviorPropertyId,
        });
      }
    });
  });
  // Save behaviors states
  await axios.post(
    config.xtvision.databaseUrl + "/behaviorsStates",
    behaviorsStates,
    {
      headers: {
        Authorization: prefs.databaseAuth,
      },
    }
  );
  return statesTypesToReturn;
}

/**
 * Link in database equipments brands and action types and save the link in the database
 */
async function linkAndSaveBrandsAndActionsTypesInDb(
  configsActionsTypes: ActionTypeServerInterface[],
  equipmentsBrands: EquipmentBrandDatabaseInterface[],
  actionsTypes: ActionTypeDatabaseInterface[]
) {
  logger.info("linkAndSaveBrandsAndActionsTypesInDb");
  const brandsActionsTypes: BrandActionTypeDatabaseInterface[] = [];
  // Link action types and brands
  for (const cta of configsActionsTypes) {
    const actionTypeId = actionsTypes.find(
      actionType => actionType.name === cta.name
    )!.id;
    cta.concernedBrands.forEach(brand => {
      const brandId = equipmentsBrands.find(
        equipmentBrand => equipmentBrand.name === brand
      )!.id;
      brandsActionsTypes.find(
        brandActionType =>
          brandActionType.EquipmentBrandId === brandId &&
          brandActionType.ActionTypeId === actionTypeId
      ) ??
        brandsActionsTypes.push({
          EquipmentBrandId: brandId,
          ActionTypeId: actionTypeId,
        });
    });
  }
  // Save brands ids and action types ids linked
  await axios.post(
    config.xtvision.databaseUrl + "/brandsActionsTypes",
    brandsActionsTypes,
    {
      headers: {
        Authorization: prefs.databaseAuth,
      },
    }
  );
}

/**
 * Link in database equipments brands and states and save the link in the database
 */
async function linkAndSaveBrandsAndStatesInDb(
  configsStates: StateServerInterface[],
  equipmentsBrands: EquipmentBrandDatabaseInterface[],
  states: StateDatabaseInterface[]
) {
  logger.info("linkAndSaveBrandsAndStatesInDb");
  const brandsStates: BrandStateDatabaseInterface[] = [];
  // Link states and brands
  for (const cs of configsStates) {
    const stateId = states.find(state => state.name === cs.name)!.id;
    for (const brand of cs.concernedBrands) {
      const brandId = equipmentsBrands.find(be => be.name === brand)!.id;
      if (
        !brandsStates.find(
          bs => bs.EquipmentBrandId === brandId && bs.StateId === stateId
        )
      ) {
        brandsStates.push({
          EquipmentBrandId: brandId,
          StateId: stateId,
        });
      }
    }
  }
  // Save brands ids and states ids linked
  await axios.post(
    config.xtvision.databaseUrl + "/brandsStates",
    brandsStates,
    {
      headers: {
        Authorization: prefs.databaseAuth,
      },
    }
  );
}

/**
 * Link in database action types and params, states and params and save the link and the params in the database
 */
async function linkAndSaveParamsInDb(
  configStates: StateServerInterface[],
  configActionsTypes: ActionTypeServerInterface[],
  states: StateDatabaseInterface[],
  actionsTypes: ActionTypeDatabaseInterface[]
) {
  logger.info("linkAndSaveParamsInDb");
  const paramsToSave: NewParam[] = [];
  // Set params to save from JSON
  configStates.forEach(configState => {
    configState.stateParam?.forEach(sp => {
      if (!paramsToSave.find(element => element.nameId === sp.id)) {
        paramsToSave.push({
          nameId: sp.id,
          labelFr: sp.labelFr,
          labelEn: sp.labelEn,
          kind: sp.type,
          paramValues: sp.value ? JSON.stringify(sp.value) : "",
        });
      }
    });
  });

  configActionsTypes.forEach(configActionsType => {
    configActionsType.actionParams?.forEach(ap => {
      if (!paramsToSave.find(element => element.nameId === ap.id)) {
        paramsToSave.push({
          nameId: ap.id,
          labelFr: ap.labelFr,
          labelEn: ap.labelEn,
          kind: "",
          paramValues: ap.value ? JSON.stringify(ap.value) : "",
        });
      }
    });
  });

  // Save params in DB
  const paramsToReturn: ParamDatabaseInterface[] = (
    await axios.post(config.xtvision.databaseUrl + "/params", paramsToSave, {
      headers: {
        Authorization: prefs.databaseAuth,
      },
    })
  ).data;
  // Link states and params
  const statesParams: StateParamDatabaseInterface[] = [];
  configStates.forEach(configState => {
    configState.stateParam?.forEach(sp => {
      const StateId = states.find(state => state.name === configState.name)!.id;
      const paramId = paramsToReturn.find(
        element => element.nameId === sp.id
      )!.id;
      if (
        !statesParams.find(
          stateParam =>
            stateParam.ParamId === paramId && stateParam.StateId === StateId
        )
      ) {
        statesParams.push({
          StateId: StateId,
          ParamId: paramId,
        });
      }
    });
  });
  // Link action types and params
  const actionsTypesParams: ActionTypeParamDatabaseInterface[] = [];
  configActionsTypes.forEach(configActionsType => {
    configActionsType.actionParams?.forEach(actionParam => {
      const actionTypeId = actionsTypes.find(
        ta => ta.name === configActionsType.name
      )!.id;
      const paramId = paramsToReturn.find(
        element => element.nameId === actionParam.id
      )!.id;
      if (
        !actionsTypesParams.find(
          tap => tap.ParamId === paramId && tap.ActionTypeId === actionTypeId
        )
      ) {
        actionsTypesParams.push({
          ActionTypeId: actionTypeId,
          ParamId: paramId,
        });
      }
    });
  });
  // Save states and params linked
  await axios.post(
    config.xtvision.databaseUrl + "/statesParams",
    statesParams,
    {
      headers: {
        Authorization: prefs.databaseAuth,
      },
    }
  );
  // Save action types and params linked
  await axios.post(
    config.xtvision.databaseUrl + "/actionsTypesParams",
    actionsTypesParams,
    {
      headers: {
        Authorization: prefs.databaseAuth,
      },
    }
  );
}

/**
 * Save in database the equipments brands
 */
async function saveEquipmentsBrandsInDb(
  equipmentsBrands: NewEquipmentBrand[]
): Promise<EquipmentBrandDatabaseInterface[]> {
  logger.info("saveEquipmentsBrandsInDb");
  return (
    await axios.post(
      config.xtvision.databaseUrl + "/equipmentsBrands",
      equipmentsBrands,
      {
        headers: {
          Authorization: prefs.databaseAuth,
        },
      }
    )
  ).data;
}

/**
 * Subscribe to a Web Socket from the system to get live events of it (equipments, systems,... events)
 */
async function subscribeToWsSystem(systemId: number) {
  logger.info(`subscribeToWsSystem with id ${systemId}`);
  if (mapSystems.has(systemId)) {
    mapSystems.get(systemId)?.close(4000);
    mapSystems.delete(systemId);
  }

  const system = await getSystemFromDb(systemId);

  // Can't have space in URL
  const wsSystem = new ws(
    `${
      system.url_connexion_ws
    }?Authorization=${await getAuthorizationStringFromSystemDb(
      system
    )}`.replace(" ", "%20"),
    {
      rejectUnauthorized: true,
      cert: credentials.cert,
      key: credentials.key,
      ca: credentials.ca,
    }
  );

  wsSystem.on("open", () => {
    logger.info(`WS system opened with id ${systemId}`);
    (async () => {
      await updateSystemInDb(systemId, { state: CONNECTED });
    })();
    const eventSystem: EventServerInterface = {
      sequenceNumber: 0,
      timestamp: new Date(),
      equipmentProperty: SYSTEM,
      equipmentGid: 0,
      stateName: SYSTEM_STARTED,
      systemId: systemId,
      systemName: "",
      params: {},
      paramsEquipment: {},
    };
    // Inform Front that system is started
    subject.notifyObservers([eventSystem]);
  });

  wsSystem.on("message", data => {
    if (data && data instanceof Buffer) {
      const events: EventServerInterface[] = JSON.parse(data.toString());
      if (events instanceof Array) {
        events.forEach(evt => {
          evt.systemId = systemId;
          evt.systemName = system.name;
          evt.params = JSON.stringify(evt.params);
        });
        subject.notifyObservers(events);
      }
    }
  });

  wsSystem.on("close", code => {
    logger.info(`WS system closed with code ${code} and id ${systemId}`);
    // Code 4000 = system deleted by user so we don't try to reconnect or to do something on it
    if (code !== 4000) {
      (async () => {
        await updateSystemInDb(systemId, { state: DISCONNECTED });
        const system = await getSystemFromDb(systemId);
        await reconnectToSystemsFromDb([system]);
      })();
      const eventSystem: EventServerInterface = {
        sequenceNumber: 0,
        timestamp: new Date(),
        equipmentProperty: SYSTEM,
        equipmentGid: 0,
        stateName: SYSTEM_STOPPED,
        systemId: systemId,
        systemName: "",
        params: {},
        paramsEquipment: {},
      };
      // Inform Front that system is stopped
      subject.notifyObservers([eventSystem]);
    }
  });

  wsSystem.on("error", error => {
    logger.error(`Error WS system with id ${systemId}`, error);
  });

  mapSystems.set(systemId, wsSystem);
}
