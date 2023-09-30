import assert from "assert";
import { customAxios as axios, WebServer } from "../../src/webServer";
import { newCastelSuiteDb } from "../data/systems.data";
import { equipmentTypes } from "../data/equipmentTypes.data";
import { actionTypes } from "../data/actionTypes.data";
import { ActionTypeDatabaseInterface } from "../../src/database/interfaces/actionType.database";
import { states } from "../data/states.data";
import { StateDatabaseInterface } from "../../src/database/interfaces/state.database";
import { newEquipmentsDb } from "../data/equipments.data";
import { EquipmentDatabaseInterface } from "../../src/database/interfaces/equipment.database";
import { behavs } from "../data/behaviors.data";
import {
  equipmentsTypesEquipmentsProperties,
  equipmentsProperties,
} from "../data/equipmentsProperties.data";
import { WebServerTestOAuth2 } from "./webServerTestOAuth2";
import { WebServerTestCastelSuite } from "./webServerTestCastelSuite";
import { domain1 } from "../data/domains.data";
import { param1, param2, param3, sps, taps } from "../data/params.data";
import { brandsTypes } from "../data/brands.data";
import { httPrefix } from "../../src/server/resources/config";
import { databaseHeader, header, initPrefsForTests } from "./utilities";

const url = `${httPrefix}:5001/equipmentsTypes`;
const databaseUrl = `${httPrefix}:5001/database`;

describe("equipment type", function () {
  initPrefsForTests();

  const webServer = new WebServer({ port: 5001 });
  const webServerTestOAuth2 = new WebServerTestOAuth2();
  // Mock Castel Suite server
  const webServerTestCastelSuite = new WebServerTestCastelSuite();
  before(async () => {
    await webServerTestCastelSuite.start();
    await webServerTestOAuth2.start();
    await webServer.start();
  });
  after(async () => {
    await webServer.stop();
    await webServerTestOAuth2.stop();
    await webServerTestCastelSuite.stop();
  });

  it("should find action types for one type equipment", async () => {
    await clearDatabase();

    // Create system, equipment types and action types linked
    await axios.post(
      databaseUrl + "/systems",
      newCastelSuiteDb,
      databaseHeader
    );
    await axios.post(
      databaseUrl + "/equipmentsTypes",
      equipmentTypes,
      databaseHeader
    );
    await axios.post(
      databaseUrl + "/equipmentsBrands",
      brandsTypes,
      databaseHeader
    );
    await axios.post(
      databaseUrl + "/equipmentsProperties",
      equipmentsProperties,
      databaseHeader
    );
    await axios.post(
      databaseUrl + "/equipmentsTypesEquipmentsProperties",
      equipmentsTypesEquipmentsProperties,
      databaseHeader
    );
    await axios.post(
      databaseUrl + "/actionsTypes",
      actionTypes,
      databaseHeader
    );
    await axios.post(databaseUrl + "/params", [param1, param2], databaseHeader);
    await axios.post(databaseUrl + "/actionsTypesParams", taps, databaseHeader);

    // Check there are action types for equipmentTypeId and 0 for another id
    const actionsTypes = await (
      await axios.get(url + "/1/actionsTypes", header)
    ).data;
    assert((actionsTypes as ActionTypeDatabaseInterface[]).length === 2);
    const actionsTypes2 = await (
      await axios.get(url + "/2/actionsTypes", header)
    ).data;
    assert((actionsTypes2 as ActionTypeDatabaseInterface[]).length === 2);
    const actionsTypes3 = await (
      await axios.get(url + "/3/actionsTypes", header)
    ).data;
    assert((actionsTypes3 as ActionTypeDatabaseInterface[]).length === 0);
    const actionsTypes4 = await (
      await axios.get(url + "/0/actionsTypes", header)
    ).data;
    assert((actionsTypes4 as ActionTypeDatabaseInterface[]).length === 0);

    await clearDatabase();
  });

  it("should find states for one type equipment", async () => {
    await clearDatabase();

    // Create system, equipment types and states linked
    await axios.post(
      databaseUrl + "/systems",
      newCastelSuiteDb,
      databaseHeader
    );
    await axios.post(
      databaseUrl + "/equipmentsTypes",
      equipmentTypes,
      databaseHeader
    );
    await axios.post(
      databaseUrl + "/equipmentsBrands",
      brandsTypes,
      databaseHeader
    );
    await axios.post(
      databaseUrl + "/equipmentsProperties",
      equipmentsProperties,
      databaseHeader
    );
    await axios.post(
      databaseUrl + "/equipmentsTypesEquipmentsProperties",
      equipmentsTypesEquipmentsProperties,
      databaseHeader
    );
    await axios.post(databaseUrl + "/states", states, databaseHeader);
    await axios.post(databaseUrl + "/params", param3, databaseHeader);
    await axios.post(databaseUrl + "/statesParams", sps, databaseHeader);

    // Check there are states for equipmentTypeId and 0 for another id
    const statesDb = await (await axios.get(url + "/1/states", header)).data;
    assert((statesDb as StateDatabaseInterface[]).length === 2);
    const statesDb2 = await (await axios.get(url + "/2/states", header)).data;
    assert((statesDb2 as StateDatabaseInterface[]).length === 2);
    const statesDb3 = await (await axios.get(url + "/3/states", header)).data;
    assert((statesDb3 as StateDatabaseInterface[]).length === 1);
    const statesDb4 = await (await axios.get(url + "/0/states", header)).data;
    assert((statesDb4 as StateDatabaseInterface[]).length === 0);

    await clearDatabase();
  });

  it("should find equipments for one type equipment", async () => {
    await clearDatabase();

    // Create system, equipment types and equipments linked
    await axios.post(
      databaseUrl + "/systems",
      newCastelSuiteDb,
      databaseHeader
    );
    await axios.post(
      databaseUrl + "/equipmentsTypes",
      equipmentTypes,
      databaseHeader
    );
    await axios.post(
      databaseUrl + "/equipmentsBrands",
      brandsTypes,
      databaseHeader
    );
    await axios.post(databaseUrl + "/behaviors", behavs, databaseHeader);
    await axios.post(databaseUrl + "/domains", domain1, databaseHeader);
    await axios.post(
      databaseUrl + "/equipments",
      newEquipmentsDb,
      databaseHeader
    );

    // Check there are equipments for equipmentTypeId and 0 for another id
    const equipments = await (
      await axios.get(url + "/1/equipments", header)
    ).data;
    assert((equipments as EquipmentDatabaseInterface[]).length === 1);
    const equipments2 = await (
      await axios.get(url + "/2/equipments", header)
    ).data;
    assert((equipments2 as EquipmentDatabaseInterface[]).length === 1);
    const equipments3 = await (
      await axios.get(url + "/3/equipments", header)
    ).data;
    assert((equipments3 as EquipmentDatabaseInterface[]).length === 2);
    const equipments4 = await (
      await axios.get(url + "/0/equipments", header)
    ).data;
    assert((equipments4 as EquipmentDatabaseInterface[]).length === 0);

    await clearDatabase();
  });
});

async function clearDatabase() {
  await axios.delete(`${httPrefix}:5001/systems`, header);
}
