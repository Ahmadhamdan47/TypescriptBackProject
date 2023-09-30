import { NewCurrentEquipmentState } from "../../database/interfaces/currentEquipmentState.database";
import { EquipmentDatabaseInterface } from "../../database/interfaces/equipment.database";
import { EquipmentPropertyDatabaseInterface } from "../../database/interfaces/equipmentProperty.database";
import { StateDatabaseInterface } from "../../database/interfaces/state.database";
import config from "../resources/config";
import { prefs, customAxios as axios } from "../../webServer";

export interface CurrentEquipmentStateServerInterface {
  gid: number;
  equipmentsPropertiesStates: EquipmentPropertyStateServerInterface[];
}

export interface EquipmentPropertyStateServerInterface {
  equipmentProperty: string;
  state: string;
}

async function getCurrentEquipmentsStatesForDatabase(
  systemAuth: string,
  currentsEquipmentsStates: CurrentEquipmentStateServerInterface[],
  equipments: EquipmentDatabaseInterface[],
  equipmentsProperties?: EquipmentPropertyDatabaseInterface[],
  states?: StateDatabaseInterface[],
  equipmentsTypesIds?: number[]
): Promise<NewCurrentEquipmentState[]> {
  if (!equipmentsProperties && equipmentsTypesIds) {
    equipmentsProperties = (
      await Promise.all(
        equipmentsTypesIds.map(
          async equipmentTypeId =>
            (
              await axios.get(
                config.xtvision.databaseUrl +
                  "/equipmentsProperties?equipmentTypeId=" +
                  equipmentTypeId,
                {
                  headers: {
                    Authorization: prefs.databaseAuth,
                  },
                }
              )
            ).data
        )
      )
    )
      .flat()
      .filter(
        (equipmentProperty, index, self) =>
          index === self.findIndex(t => t.id === equipmentProperty.id)
      );
  }
  if (!states) {
    states = (
      await axios.post(
        config.xtvision.databaseUrl + "/states/equipmentsPropertiesIds",
        equipmentsProperties?.map(ep => ep.id),
        {
          headers: {
            Authorization: systemAuth,
          },
        }
      )
    ).data;
  }
  const result: NewCurrentEquipmentState[] = [];
  currentsEquipmentsStates.forEach(equipmentState => {
    const equipmentId = equipments.find(
      equip => equip.gid === equipmentState.gid
    )?.id;
    equipmentState.equipmentsPropertiesStates.forEach(varState => {
      const equipmentPropertyId = equipmentsProperties?.find(
        equipmentProperty =>
          equipmentProperty.name === varState.equipmentProperty
      )?.id;
      const currentStateId = states?.find(
        state => state.name === varState.state
      )?.id;
      if (equipmentId && equipmentPropertyId && currentStateId) {
        result.push({
          equipmentId,
          equipmentPropertyId,
          currentStateId,
        } as NewCurrentEquipmentState);
      }
    });
  });
  return result;
}

export async function setAndCreateCurrentEquipmentsStates(
  systemAuth: string,
  currentsEquipmentsStates: CurrentEquipmentStateServerInterface[],
  equipments: EquipmentDatabaseInterface[],
  equipmentsProperties?: EquipmentPropertyDatabaseInterface[],
  states?: StateDatabaseInterface[],
  equipmentsTypesIds?: number[]
) {
  const result = await getCurrentEquipmentsStatesForDatabase(
    systemAuth,
    currentsEquipmentsStates,
    equipments,
    equipmentsProperties,
    states,
    equipmentsTypesIds
  );
  await axios.post(
    config.xtvision.databaseUrl + "/currentEquipmentStates",
    result,
    {
      headers: {
        Authorization: prefs.databaseAuth,
      },
    }
  );
}

export async function setAndUpdateCurrentEquipmentsStates(
  systemAuth: string,
  currentsEquipmentsStates: CurrentEquipmentStateServerInterface[],
  equipments: EquipmentDatabaseInterface[],
  equipmentsProperties?: EquipmentPropertyDatabaseInterface[],
  states?: StateDatabaseInterface[],
  equipmentsTypesIds?: number[]
) {
  const result = await getCurrentEquipmentsStatesForDatabase(
    systemAuth,
    currentsEquipmentsStates,
    equipments,
    equipmentsProperties,
    states,
    equipmentsTypesIds
  );
  await axios.put(
    config.xtvision.databaseUrl + "/currentEquipmentStates",
    result,
    {
      headers: {
        Authorization: prefs.databaseAuth,
      },
    }
  );
}
