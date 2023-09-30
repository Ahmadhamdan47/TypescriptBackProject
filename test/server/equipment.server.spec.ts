import assert from "assert";
import { customAxios as axios, WebServer } from "../../src/webServer";
import { newCastelSuiteDb } from "../data/systems.data";
import { equipmentTypes } from "../data/equipmentTypes.data";
import { actionType1, actionTypes } from "../data/actionTypes.data";
import { states } from "../data/states.data";
import { newEquipmentsDb, newEquipmentsEvents } from "../data/equipments.data";
import { XtvisionEquipmentConfigDatabaseInterface } from "../../src/database/interfaces/xtvisionEquipmentConfig.database";
import { behavs } from "../data/behaviors.data";
import {
  equipmentsProperties,
  equipmentsTypesEquipmentsProperties,
} from "../data/equipmentsProperties.data";
import { WebServerTestOAuth2 } from "./webServerTestOAuth2";
import { WebServerTestCastelSuite } from "./webServerTestCastelSuite";
import { domain1 } from "../data/domains.data";
import { param1, param2, param3, sps, taps } from "../data/params.data";
import {
  newBrandsActionsTypes,
  newBrandsStates,
  brandsTypes,
} from "../data/brands.data";
import { ActionTypeDatabaseInterface } from "../../src/database/interfaces/actionType.database";
import { StateDatabaseInterface } from "../../src/database/interfaces/state.database";
import { EquipmentDatabaseInterface } from "../../src/database/interfaces/equipment.database";
import { PaginationResultServerInterface } from "../../src/server/interfaces/pagination.server";
import { httPrefix } from "../../src/server/resources/config";
import { databaseHeader, header, initPrefsForTests } from "./utilities";

const url = `${httPrefix}:5001/equipments`;
const databaseUrl = `${httPrefix}:5001/database`;

describe("equipment", function () {
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

  it("should set isSupervised for one equipment", async () => {
    await clearDatabase();

    // Create system, equipment types, equipments and xtvision equipments configs linked
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

    // Update one xtvision equipment config
    await axios.put(
      `${httPrefix}:5001/xtvisionEquipmentConfigs/1`,
      { isSupervised: true },
      header
    );

    // Check that the xtvision equipment config is updated
    const confE1 = (
      await axios.get(
        databaseUrl + "/xtvisionEquipmentConfigs/1",
        databaseHeader
      )
    ).data as XtvisionEquipmentConfigDatabaseInterface;
    assert(confE1.isSupervised);

    await clearDatabase();
  });

  it("should subscribe/unsubscribe events from equipments of a system", async () => {
    await clearDatabase();

    // Create system, equipments types, equipments and xtvision equipments configs linked
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

    // Subscribe and unsubscribe
    const requestSub = await axios.post(
      url + "/events",
      newEquipmentsEvents,
      header
    );
    assert(requestSub.status === 200);

    // Check that the xtvision equipment config is updated
    const xtVisionEquipsConfigsSubs = (
      await axios.get(databaseUrl + "/xtvisionEquipmentConfigs", databaseHeader)
    ).data as XtvisionEquipmentConfigDatabaseInterface[];
    assert(xtVisionEquipsConfigsSubs[0].isSupervised);
    assert(xtVisionEquipsConfigsSubs[1].isSupervised);
    assert(!xtVisionEquipsConfigsSubs[2].isSupervised);
    assert(!xtVisionEquipsConfigsSubs[3].isSupervised);

    await clearDatabase();
  });

  it("should operate an equipment to do an action in a system", async () => {
    await clearDatabase();

    // Create system, equipment types, equipments and xtvision equipments configs linked
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

    // Operate action
    const paramsBody: Map<string, string> = new Map();
    const request = await axios.post(
      url + "/1/actions/" + actionType1.name,
      paramsBody,
      header
    );
    assert(request.status === 200);

    await clearDatabase();
  });

  it("should find action types for one equipment brand", async () => {
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
    await axios.post(
      databaseUrl + "/brandsActionsTypes",
      newBrandsActionsTypes,
      databaseHeader
    );

    // Check there are action types for each brand
    const actionsTypes = await (
      await axios.get(url + "/actionsTypes?equipmentBrandId=1", header)
    ).data;
    assert((actionsTypes as ActionTypeDatabaseInterface[]).length === 2);
    const actionsTypes2 = await (
      await axios.get(url + "/actionsTypes?equipmentBrandId=0", header)
    ).data;
    assert((actionsTypes2 as ActionTypeDatabaseInterface[]).length === 0);
    const actionsTypes3 = await (
      await axios.get(url + "/actionsTypes?equipmentBrandId=3", header)
    ).data;
    assert((actionsTypes3 as ActionTypeDatabaseInterface[]).length === 0);

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
    await axios.post(
      databaseUrl + "/brandsStates",
      newBrandsStates,
      databaseHeader
    );

    // Check there are states for each brand
    const statesDb = await (
      await axios.get(url + "/states?equipmentBrandId=1", header)
    ).data;
    assert((statesDb as StateDatabaseInterface[]).length === 2);
    const statesDb2 = await (
      await axios.get(url + "/states?equipmentBrandId=0", header)
    ).data;
    assert((statesDb2 as StateDatabaseInterface[]).length === 0);
    const statesDb3 = await (
      await axios.get(url + "/states?equipmentBrandId=3", header)
    ).data;
    assert((statesDb3 as StateDatabaseInterface[]).length === 1);

    await clearDatabase();
  });

  it("should find equipments with filters", async () => {
    await clearDatabase();

    // Create system, equipment types, domains and equipments linked
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
    await axios.post(databaseUrl + "/domains", domain1, databaseHeader);
    await axios.post(databaseUrl + "/behaviors", behavs, databaseHeader);
    const equipments = (
      await axios.post(
        databaseUrl + "/equipments",
        newEquipmentsDb,
        databaseHeader
      )
    ).data as EquipmentDatabaseInterface[];

    // Check some equipments filters
    let equipmentsFiltered: PaginationResultServerInterface = await (
      await axios.post(url + "/filter", { domainId: 2 }, header)
    ).data;
    assert(
      (equipmentsFiltered.datas as EquipmentDatabaseInterface[]).length ===
        equipments.filter(equip => equip.domainId === 2).length
    );
    equipmentsFiltered = await (
      await axios.post(url + "/filter", { domainId: 1 }, header)
    ).data;
    assert(
      (equipmentsFiltered.datas as EquipmentDatabaseInterface[]).length ===
        equipments.filter(equip => equip.domainId === 1).length
    );
    equipmentsFiltered = await (
      await axios.post(url + "/filter", { canReceiveTextMessage: true }, header)
    ).data;
    assert(
      (equipmentsFiltered.datas as EquipmentDatabaseInterface[]).length ===
        equipments.filter(equip => equip.canReceiveTextMessage).length
    );
    equipmentsFiltered = await (
      await axios.post(url + "/filter", { name: "Maylis" }, header)
    ).data;
    assert(
      (equipmentsFiltered.datas as EquipmentDatabaseInterface[]).length ===
        equipments.filter(equip => equip.name.includes("Maylis")).length
    );

    await clearDatabase();
  });

  it("should find equipments with pagination", async () => {
    await clearDatabase();

    // Create system, equipment types, domains and equipments linked
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
    await axios.post(databaseUrl + "/domains", domain1, databaseHeader);
    await axios.post(databaseUrl + "/behaviors", behavs, databaseHeader);
    await axios.post(
      databaseUrl + "/equipments",
      newEquipmentsDb,
      databaseHeader
    );

    // Check some equipments with pagination
    let equips: PaginationResultServerInterface = await (
      await axios.get(url + "?page=3&size=1", header)
    ).data;
    assert(equips.currentPage === 3);
    assert(equips.totalItems === newEquipmentsDb.length);
    assert((equips.datas as EquipmentDatabaseInterface[]).length === 1);
    assert((equips.datas[0].id as number) === newEquipmentsDb[2].id);
    equips = await (await axios.get(url, header)).data;
    assert(equips.currentPage === 1);
    assert(equips.totalItems === newEquipmentsDb.length);
    assert(
      (equips.datas as EquipmentDatabaseInterface[]).length ===
        newEquipmentsDb.length
    );

    await clearDatabase();
  });
});

async function clearDatabase() {
  await axios.delete(`${httPrefix}:5001/systems`, header);
}
