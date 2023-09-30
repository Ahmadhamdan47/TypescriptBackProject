import { Server } from "http";
import { BehaviorStateDatabaseInterface } from "../../database/interfaces/behaviorState.database";
import {
  EquipmentDatabaseInterface,
  NewEquipment,
} from "../../database/interfaces/equipment.database";
import { CurrentEquipmentStateDatabaseInterface } from "../../database/interfaces/currentEquipmentState.database";
import { NewEvent } from "../../database/interfaces/event.database";
import config from "../resources/config";
import { prefs, customAxios as axios } from "../../webServer";
import { BehaviorServerInterface } from "../interfaces/behavior.server";
import {
  EventServerInterface,
  FrontEventServerInterface,
  FullEventServerInterface,
} from "../interfaces/event.server";
import { WsFrontBackObserver } from "./wsFrontBack.server.observer";
import { Subject, WsFrontBackSubject } from "./wsFrontBack.server.subject";
import { BehaviorDatabaseInterface } from "../../database/interfaces/behavior.database";
import {
  CurrentEquipmentStateServerInterface,
  setAndCreateCurrentEquipmentsStates,
} from "../interfaces/currentEquipmentState.server";
import {
  ADD_EQUIPMENT,
  EQUIPMENT,
  LINKED,
  REMOVE_EQUIPMENT,
  SYSTEM,
  UNLINKED,
} from "../resources/constants";
import { DomainDatabaseInterface } from "../../database/interfaces/domain.database";
import { EquipmentBrandDatabaseInterface } from "../../database/interfaces/equipmentBrand.database";
import {
  getAuthorizationStringFromSystemDb,
  getSystemFromDb,
} from "../interfaces/system.server";

const subject: Subject = new WsFrontBackSubject();

export interface Observer {
  notify(event: EventServerInterface[]): void;
}

export class EventObserver implements Observer {
  constructor(protected server: Server) {
    subject.addObserver(new WsFrontBackObserver(server));
  }

  async notify(events: EventServerInterface[]) {
    const eventsForWs = await manageEvents(events);
    // Event sent to observer web socket front/back
    subject.notifyObservers(eventsForWs);
  }
}

/**
 * Make some processings for each event received from systems
 */
async function manageEvents(
  events: EventServerInterface[]
): Promise<FrontEventServerInterface[]> {
  const eventsForWs: FrontEventServerInterface[] = [];
  for (const event of events) {
    if (event.stateName.includes(EQUIPMENT)) {
      await manageChangeEquipmentEvent(event, eventsForWs);
    } else if (event.stateName.includes(SYSTEM)) {
      await manageChangeSystemEvent(event, eventsForWs);
    } else {
      await manageEventWithBehaviorAndState(event, eventsForWs);
    }
  }
  return eventsForWs;
}

/**
 * Manage delete, update and add equipment events
 */
async function manageChangeEquipmentEvent(
  event: EventServerInterface,
  eventsForWs: FrontEventServerInterface[]
) {
  switch (event.stateName) {
    case ADD_EQUIPMENT:
      await addEquipment(event);
      break;
    case REMOVE_EQUIPMENT:
      await unlinkEquipment(event);
      break;
    // TODO modify equipment event
  }
  eventsForWs.push({
    state: event.stateName,
    equipmentName: event.equipmentGid.toString(),
    equipmentProperty: event.equipmentProperty,
    icon: "No icon for this event",
  });
}

/**
 * Manage start, stop and update system events
 */
async function manageChangeSystemEvent(
  event: EventServerInterface,
  eventsForWs: FrontEventServerInterface[]
) {
  // TODO update system event
  // TODO Front call API after event system is started to update equipments, currents equipments states,...
  eventsForWs.push({
    state: event.stateName,
    equipmentName: event.systemId.toString(),
    equipmentProperty: event.equipmentProperty,
    icon: "No icon for this event",
  });
}

/**
 * Proccessings for "add equipement event"
 */
async function addEquipment(event: EventServerInterface) {
  // Save equipment with ids equipment brand and behavior
  const equipmentBrand = (
    await axios.get(
      config.xtvision.databaseUrl +
        "/equipmentsBrands/filterOne?systemId=" +
        event.systemId +
        "&name=" +
        event.paramsEquipment.type,
      {
        headers: {
          Authorization: prefs.databaseAuth,
        },
      }
    )
  ).data as EquipmentBrandDatabaseInterface;
  const behavior = (
    await axios.get(
      config.xtvision.databaseUrl +
        "/behaviors/filterOne?equipmentTypeId=" +
        equipmentBrand.equipmentTypeId,
      {
        headers: {
          Authorization: prefs.databaseAuth,
        },
      }
    )
  ).data as BehaviorDatabaseInterface;
  const domain = (
    await axios.get(
      config.xtvision.databaseUrl +
        "/domains/filterOne?domainSystemId=" +
        event.paramsEquipment.domainId +
        "&systemId=" +
        event.systemId,
      {
        headers: {
          Authorization: prefs.databaseAuth,
        },
      }
    )
  ).data as DomainDatabaseInterface;
  const equipmentToSave: NewEquipment = {
    gid: event.paramsEquipment.audioVideoGid,
    name: event.paramsEquipment.name,
    label: event.paramsEquipment.label,
    ipAddress: event.paramsEquipment.ipAddress,
    release: event.paramsEquipment.release,
    camera: event.paramsEquipment.camera,
    status: LINKED,
    equipmentBrandId: equipmentBrand.id,
    behaviorId: behavior.id,
    domainId: domain.id,
    canReceiveTextMessage: event.paramsEquipment.canReceiveTextMessage,
  };
  const equipment = (
    await axios.post(
      config.xtvision.databaseUrl + "/equipments",
      equipmentToSave,
      {
        headers: {
          Authorization: prefs.databaseAuth,
        },
      }
    )
  ).data as EquipmentDatabaseInterface;
  // Get system url api
  const system = await getSystemFromDb(event.systemId);
  const systemAuth = await getAuthorizationStringFromSystemDb(system);
  // Get and save current equipment states from system
  const equipmentsStates = (
    await axios.get(
      system.url_connexion_api +
        "/equipmentTypes/states?equipmentType=" +
        event.equipmentProperty +
        "&equipmentGid=" +
        event.paramsEquipment.audioVideoGid,
      {
        headers: {
          Authorization: systemAuth,
        },
      }
    )
  ).data as CurrentEquipmentStateServerInterface[];
  await setAndCreateCurrentEquipmentsStates(
    systemAuth,
    equipmentsStates,
    [equipment],
    undefined,
    undefined,
    Array.from(new Array(1), () => Number(equipmentBrand.equipmentTypeId))
  );
}

/**
 * Proccessings for "delete equipement event"
 */
async function unlinkEquipment(event: EventServerInterface) {
  // Get id equipment from equipment gid and server id
  const equipment = (
    await axios.get(
      config.xtvision.databaseUrl +
        "/equipments/gid/" +
        event.equipmentGid +
        "?systemId=" +
        event.systemId,
      {
        headers: {
          Authorization: prefs.databaseAuth,
        },
      }
    )
  ).data as EquipmentDatabaseInterface;
  // Set the status equipment to "UNLINKED" with the id
  await axios.put(
    config.xtvision.databaseUrl + "/equipments/" + equipment.id,
    { status: UNLINKED },
    {
      headers: {
        Authorization: prefs.databaseAuth,
      },
    }
  );
}

/**
 * Proccessings for "equipments events (calling, status, door opened,...)"
 */
async function manageEventWithBehaviorAndState(
  event: EventServerInterface,
  eventsForWs: FrontEventServerInterface[]
) {
  // Get equipment to get behavior id concerned from equipment gid and server id
  const equipment = (
    await axios.get(
      config.xtvision.databaseUrl +
        "/equipments/gid/" +
        event.equipmentGid +
        "?systemId=" +
        event.systemId,
      {
        headers: {
          Authorization: prefs.databaseAuth,
        },
      }
    )
  ).data as EquipmentDatabaseInterface;
  // Get behavior, behaviors properties and behaviors states from behavior id
  if (equipment) {
    const behavior = (
      await axios.get(
        config.xtvision.databaseUrl + "/behaviors/" + equipment.behaviorId,
        {
          headers: {
            Authorization: prefs.databaseAuth,
          },
        }
      )
    ).data as BehaviorServerInterface;
    if (behavior) {
      const behaviorProperty = behavior.BehaviorProperties.find(
        bv => bv.name === event.equipmentProperty
      );
      if (behaviorProperty) {
        const behaviorState = (
          await axios.get(
            config.xtvision.databaseUrl +
              "/behaviorsStates?behaviorPropertyId=" +
              behaviorProperty.id +
              "&state=" +
              event.stateName,
            {
              headers: {
                Authorization: prefs.databaseAuth,
              },
            }
          )
        ).data as BehaviorStateDatabaseInterface;
        if (behaviorState) {
          // Do actions if property and state are found
          const fullEvent = {
            behavior,
            behaviorProperty,
            behaviorState,
            equipment,
            event,
          };
          await saveEventAndUpdateEquipmentState(fullEvent);
          eventsForWs.push({
            state: behaviorState.name,
            equipmentName: equipment.name,
            equipmentProperty: behaviorProperty.name,
            icon: behaviorState.icon,
          });
        }
      }
    }
  }
}

/**
 * Save event in database and update equipment current state
 */
async function saveEventAndUpdateEquipmentState(
  fullEvent: FullEventServerInterface
) {
  if (fullEvent.behaviorState.mustBeArchived) {
    const eventToSave: NewEvent = {
      sequenceNumber: fullEvent.event.sequenceNumber,
      timestamp: fullEvent.event.timestamp,
      equipmentName: fullEvent.equipment.name,
      equipmentProperty: fullEvent.event.equipmentProperty,
      stateName: fullEvent.event.stateName,
      systemName: fullEvent.event.systemName,
      params: fullEvent.event.params,
    };
    // Save event in db
    await axios.post(config.xtvision.databaseUrl + "/events", eventToSave, {
      headers: {
        Authorization: prefs.databaseAuth,
      },
    });
  }
  // Update current equipment state
  const equipmentState = {
    equipmentId: fullEvent.equipment.id,
    equipmentPropertyId: fullEvent.behaviorProperty.equipmentPropertyId,
    currentStateId: fullEvent.behaviorState.stateId,
  } as CurrentEquipmentStateDatabaseInterface;
  await axios.put(
    config.xtvision.databaseUrl +
      "/currentEquipmentStates/" +
      fullEvent.equipment.id,
    equipmentState,
    {
      headers: {
        Authorization: prefs.databaseAuth,
      },
    }
  );
}
