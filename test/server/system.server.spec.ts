import assert from "assert";
import { customAxios as axios, WebServer } from "../../src/webServer";
import { WebServerTestCastelSuite } from "./webServerTestCastelSuite";
import {
  addRabbitMqSystem,
  addCastelSuiteSystem,
  newRabbitMQDb,
  newCastelSuiteDb,
} from "../data/systems.data";
import { SystemDatabaseInterface } from "../../src/database/interfaces/system.database";
import { EquipmentDatabaseInterface } from "../../src/database/interfaces/equipment.database";
import { ActionTypeDatabaseInterface } from "../../src/database/interfaces/actionType.database";
import { EquipmentTypeDatabaseInterface } from "../../src/database/interfaces/equipmentType.database";
import { StateDatabaseInterface } from "../../src/database/interfaces/state.database";
import { ParamDatabaseInterface } from "../../src/database/interfaces/param.database";
import { equipmentTypes } from "../data/equipmentTypes.data";
import { newEquipmentsDb } from "../data/equipments.data";
import { actionTypes } from "../data/actionTypes.data";
import { states } from "../data/states.data";
import { params, taps, sps } from "../data/params.data";
import { XtvisionEquipmentConfigDatabaseInterface } from "../../src/database/interfaces/xtvisionEquipmentConfig.database";
import { BehaviorDatabaseInterface } from "../../src/database/interfaces/behavior.database";
import { BehaviorStateDatabaseInterface } from "../../src/database/interfaces/behaviorState.database";
import { BehaviorBehaviorPropertyDatabaseInterface } from "../../src/database/interfaces/behaviorBehaviorProperty.database";
import { behavs } from "../data/behaviors.data";
import { behavsStates } from "../data/behaviorStates.data";
import { EquipmentPropertyDatabaseInterface } from "../../src/database/interfaces/equipmentProperty.database";
import { EquipmentTypeEquipmentPropertyDatabaseInterface } from "../../src/database/interfaces/equipmentTypeEquipmentProperty.database";
import { equipmentsTypesEquipmentsProperties } from "../data/equipmentsProperties.data";
import { WebServerTestOAuth2 } from "./webServerTestOAuth2";
import { BehaviorPropertyDatabaseInterface } from "../../src/database/interfaces/behaviorProperty.database";
import { bbv, behavsProps } from "../data/behaviorProperties.data";
import { CurrentEquipmentStateDatabaseInterface } from "../../src/database/interfaces/currentEquipmentState.database";
import { newEquipmentsStatesDb } from "../data/currentEquipmentStates.data";
import { StateParamDatabaseInterface } from "../../src/database/interfaces/stateParam.database";
import { ActionTypeParamDatabaseInterface } from "../../src/database/interfaces/actionTypeParam.database";
import { WebServerTestRabbitMQ } from "./webServerTestRabbitMQ";
import {
  EquipmentsNotifBindingKeys,
  notifBindingKey1,
  notifBindingKey2,
} from "../data/notifBindingKeys.data";
import { NotifBindingKeyDatabaseInterface } from "../../src/database/interfaces/notifBindingKey.database";
import { EquipmentNotifBindingKeyDatabaseInterface } from "../../src/database/interfaces/equipmentNotifBindingKey.database";
import { DomainDatabaseInterface } from "../../src/database/interfaces/domain.database";
import { domain1 } from "../data/domains.data";
import { BrandStateDatabaseInterface } from "../../src/database/interfaces/brandState.database";
import { BrandActionTypeDatabaseInterface } from "../../src/database/interfaces/brandActionType.database";
import {
  brandsTypes,
  newBrandsStates,
  newBrandsActionsTypes,
} from "../data/brands.data";
import { EquipmentBrandDatabaseInterface } from "../../src/database/interfaces/equipmentBrand.database";
import { httPrefix } from "../../src/server/resources/config";
import { CASTELSUITE } from "../../src/server/resources/constants";
import { AuthMode } from "../../src/server/interfaces/addSystem.server";
import { databaseHeader, header, initPrefsForTests } from "./utilities";

const url = `${httPrefix}:5001/systems`;
const databaseUrl = `${httPrefix}:5001/database`;
const actionUrl = `${httPrefix}:5001/database/generalUserActions`;
let systemId = 0;

describe("system", function () {
  initPrefsForTests();

  const webServer = new WebServer({ port: 5001 });
  const webServerTestOAuth2 = new WebServerTestOAuth2();
  // Mock Castel Suite server
  const webServerTestCastelSuite = new WebServerTestCastelSuite();
  //Mock RabbitMQ server
  const webServerTestRabbitMQ = new WebServerTestRabbitMQ();
  before(async () => {
    await webServerTestCastelSuite.start();
    await webServerTestOAuth2.start();
    await webServerTestRabbitMQ.start();
    await webServer.start();
  });
  after(async () => {
    await webServer.stop();
    await webServerTestRabbitMQ.stop();
    await webServerTestOAuth2.stop();
    await webServerTestCastelSuite.stop();
  });

  it("should create a RabbitMQ system", async () => {
    await clearDatabase();
    // Wait the server is started to not execute the post API "subscribe"
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Launch request to create a RabbitMQ system
    const response = await axios.post(url, addRabbitMqSystem, header);
    assert(response.status === 200);
    // Check in database if elements from RabbitMQ are inserted and OK
    const systems = await (
      await axios.get(databaseUrl + "/systems", databaseHeader)
    ).data;
    systemId = systems[0].id;

    assert((systems as SystemDatabaseInterface[]).length === 1);
    assert(systems[0].address === `${httPrefix}`);
    assert(systems[0].port === "5003");
    assert(systems[0].name === "RabbitMQ 1");
    assert(systems[0].release === "2.0.0");
    assert(systems[0].authMode === "Basic");
    assert(systems[0].user === "guest");

    const bindingKeys = await (
      await axios.get(databaseUrl + "/notifBindingKeys", databaseHeader)
    ).data;
    assert(bindingKeys.length === 10);

    const userActionResponse = await axios.get(actionUrl);
    const loggedUserActions = userActionResponse.data;
    const getAction = loggedUserActions.find(
      (action: any) =>
        action.actionObject === "system" &&
        action.actionType === "Create" &&
        action.username === "xtvision" && // Replace with the expected username
        action.isSuccessful === true
    );
    assert(getAction !== undefined);

    await clearDatabase();
  });

  it("should update the name of a RabbitMQ system", async () => {
    await clearDatabase();
    // create system
    systemId = (
      (await (
        await axios.post(
          databaseUrl + "/systems",
          newRabbitMQDb,
          databaseHeader
        )
      ).data) as SystemDatabaseInterface
    ).id;

    // Launch request to rename the system created
    const response = await axios.put(
      url + "/" + systemId,
      { name: "RabbitMQ1" },
      header
    );
    assert(response.status === 200);
    // Check if the renaming is OK
    const server = await (
      await axios.get(databaseUrl + "/systems/" + systemId, databaseHeader)
    ).data;
    assert((server as SystemDatabaseInterface).name === "RabbitMQ1");

    await clearDatabase();
  });

  it("should delete a RabbitMQ system", async () => {
    await clearDatabase();

    // Create systems and equipments linked
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
    systemId = (
      (await (
        await axios.post(
          databaseUrl + "/systems",
          newRabbitMQDb,
          databaseHeader
        )
      ).data) as SystemDatabaseInterface
    ).id;
    //create related binding keys
    await axios.post(
      databaseUrl + "/notifBindingKeys",
      notifBindingKey1,
      databaseHeader
    );
    await axios.post(
      databaseUrl + "/notifBindingKeys",
      notifBindingKey2,
      databaseHeader
    );
    await axios.post(
      databaseUrl + "/equipmentsNotifBindingKeys",
      EquipmentsNotifBindingKeys,
      databaseHeader
    );

    // Launch request to delete the system
    const response = await axios.delete(url + "/" + systemId, header);
    assert(response.status === 200);

    // Check that the tables are empty
    const systems = await (
      await axios.get(databaseUrl + "/systems", databaseHeader)
    ).data;
    assert((systems as SystemDatabaseInterface[]).length === 1);

    const notifBindingKeys = await (
      await axios.get(databaseUrl + "/notifBindingKeys", databaseHeader)
    ).data;
    assert(
      (notifBindingKeys as NotifBindingKeyDatabaseInterface[]).length === 0
    );

    const equipmentsNotifBindingKeys = await (
      await axios.get(
        databaseUrl + "/equipmentsNotifBindingKeys",
        databaseHeader
      )
    ).data;
    assert(
      (
        equipmentsNotifBindingKeys as EquipmentNotifBindingKeyDatabaseInterface[]
      ).length === 0
    );
    const userActionResponse = await axios.get(actionUrl);
    const loggedUserActions = userActionResponse.data;
    const updateAction = loggedUserActions.find(
      (action: any) =>
        action.actionObject === "system" &&
        action.actionType === "modify" &&
        action.username === "xtvision" && // Replace with the expected username
        action.isSuccessful === true
    );
    assert(updateAction !== undefined);

    await clearDatabase();
  });

  it("should create, update the name and delete a CastelSuite system", async () => {
    await clearDatabase();

    // Launch request to create a CastelSuite system
    const response = await axios.post(url, addCastelSuiteSystem, header);
    assert(response.status === 200);
    // Check in database if elements from CastelSuite are inserted and OK
    const systems = await (
      await axios.get(databaseUrl + "/systems", databaseHeader)
    ).data;
    systemId = systems[0].id;
    assert((systems as SystemDatabaseInterface[]).length === 1);
    assert(response.data.id === systemId);
    assert(systems[0].address === `${httPrefix}`);
    assert(systems[0].port === "5002");
    assert(systems[0].name === "CastelSuite 1");
    assert(systems[0].authMode === AuthMode.Basic);
    assert(systems[0].user === "castel");
    const equipments = await (
      await axios.get(databaseUrl + "/equipments", databaseHeader)
    ).data;
    assert(
      (equipments as EquipmentDatabaseInterface[]).length ===
        newEquipmentsDb.length
    );
    const domains = await (
      await axios.get(databaseUrl + "/domains", databaseHeader)
    ).data;
    assert((domains as DomainDatabaseInterface[]).length === [domain1].length);
    const xtvisionEquipmentConfigs = await (
      await axios.get(databaseUrl + "/xtvisionEquipmentConfigs", databaseHeader)
    ).data;
    assert(
      (xtvisionEquipmentConfigs as XtvisionEquipmentConfigDatabaseInterface[])
        .length === newEquipmentsDb.length
    );
    const equipmentStates = await (
      await axios.get(databaseUrl + "/currentEquipmentStates", databaseHeader)
    ).data;
    assert(
      (equipmentStates as CurrentEquipmentStateDatabaseInterface[]).length ===
        newEquipmentsStatesDb.length
    );
    const equipmentsTypes = await (
      await axios.get(databaseUrl + "/equipmentsTypes", databaseHeader)
    ).data;
    assert(
      (equipmentsTypes as EquipmentTypeDatabaseInterface[]).length ===
        equipmentTypes.length
    );
    const equipmentsBrands = await (
      await axios.get(databaseUrl + "/equipmentsBrands", databaseHeader)
    ).data;
    assert(
      (equipmentsBrands as EquipmentBrandDatabaseInterface[]).length ===
        brandsTypes.length
    );
    const equipmentsProperties = await (
      await axios.get(databaseUrl + "/equipmentsProperties", databaseHeader)
    ).data;
    assert(
      (equipmentsProperties as EquipmentPropertyDatabaseInterface[]).length ===
        equipmentsProperties.length
    );
    const actionsTypes = await (
      await axios.get(databaseUrl + "/actionsTypes", databaseHeader)
    ).data;
    assert(
      (actionsTypes as ActionTypeDatabaseInterface[]).length ===
        actionTypes.length
    );
    const statesDb = await (
      await axios.get(databaseUrl + "/states", databaseHeader)
    ).data;
    assert((statesDb as StateDatabaseInterface[]).length === states.length);
    const paramsDb = await (
      await axios.get(databaseUrl + "/params", databaseHeader)
    ).data;
    assert((paramsDb as ParamDatabaseInterface[]).length === params.length);
    const typesEquipsEquipsProps = await (
      await axios.get(
        databaseUrl + "/equipmentsTypesEquipmentsProperties",
        databaseHeader
      )
    ).data;
    assert(
      (
        typesEquipsEquipsProps as EquipmentTypeEquipmentPropertyDatabaseInterface[]
      ).length === equipmentsTypesEquipmentsProperties.length
    );
    const statesParamsDb = await (
      await axios.get(databaseUrl + "/statesParams", databaseHeader)
    ).data;
    assert(
      (statesParamsDb as StateParamDatabaseInterface[]).length === sps.length
    );
    const actionsTypesParamsDb = await (
      await axios.get(databaseUrl + "/actionsTypesParams", databaseHeader)
    ).data;
    assert(
      (actionsTypesParamsDb as ActionTypeParamDatabaseInterface[]).length ===
        taps.length
    );
    const behaviors = await (
      await axios.get(databaseUrl + "/behaviors", databaseHeader)
    ).data;
    assert((behaviors as BehaviorDatabaseInterface[]).length === behavs.length);
    const behaviorsProperties = await (
      await axios.get(databaseUrl + "/behaviorsProperties", databaseHeader)
    ).data;
    assert(
      (behaviorsProperties as BehaviorPropertyDatabaseInterface[]).length ===
        behavsProps.length
    );
    const behaviorsStates = await (
      await axios.get(databaseUrl + "/behaviorsStates", databaseHeader)
    ).data;
    assert(
      (behaviorsStates as BehaviorStateDatabaseInterface[]).length ===
        behavsStates.length
    );
    const behaviorsBehaviorsProperties = await (
      await axios.get(
        databaseUrl + "/behaviorsBehaviorsProperties",
        databaseHeader
      )
    ).data;
    assert(
      (
        behaviorsBehaviorsProperties as BehaviorBehaviorPropertyDatabaseInterface[]
      ).length === bbv.length
    );
    const brandsStates = await (
      await axios.get(databaseUrl + "/brandsStates", databaseHeader)
    ).data;
    assert(
      (brandsStates as BrandStateDatabaseInterface[]).length ===
        newBrandsStates.length
    );
    const brandsActionsTypes = await (
      await axios.get(databaseUrl + "/brandsActionsTypes", databaseHeader)
    ).data;
    assert(
      (brandsActionsTypes as BrandActionTypeDatabaseInterface[]).length ===
        newBrandsActionsTypes.length
    );

    // Launch request to rename the system created
    const response2 = await axios.put(
      url + "/" + systemId,
      { name: "CS1" },
      header
    );
    assert(response2.status === 200);
    // Check if the renaming is OK
    const server = await (
      await axios.get(databaseUrl + "/systems/" + systemId, databaseHeader)
    ).data;
    assert((server as SystemDatabaseInterface).name === "CS1");

    // Launch request to delete the renamed system
    const response3 = await axios.delete(url + "/" + systemId, header);
    assert(response3.status === 200);
    // Check that the tables are empty
    const systems2 = await (
      await axios.get(databaseUrl + "/systems", databaseHeader)
    ).data;
    assert((systems2 as SystemDatabaseInterface[]).length === 0);
    const equipments2 = await (
      await axios.get(databaseUrl + "/equipments", databaseHeader)
    ).data;
    assert((equipments2 as EquipmentDatabaseInterface[]).length === 0);
    const domains2 = await (
      await axios.get(databaseUrl + "/domains", databaseHeader)
    ).data;
    assert((domains2 as DomainDatabaseInterface[]).length === 0);
    const xtvisionEquipmentConfigs2 = await (
      await axios.get(databaseUrl + "/xtvisionEquipmentConfigs", databaseHeader)
    ).data;
    assert(
      (xtvisionEquipmentConfigs2 as XtvisionEquipmentConfigDatabaseInterface[])
        .length === 0
    );
    const equipmentStates2 = await (
      await axios.get(databaseUrl + "/currentEquipmentStates", databaseHeader)
    ).data;
    assert(
      (equipmentStates2 as CurrentEquipmentStateDatabaseInterface[]).length ===
        0
    );
    const equipmentsTypes2 = await (
      await axios.get(databaseUrl + "/equipmentsTypes", databaseHeader)
    ).data;
    assert((equipmentsTypes2 as EquipmentTypeDatabaseInterface[]).length === 0);
    const equipmentsBrands2 = await (
      await axios.get(databaseUrl + "/equipmentsBrands", databaseHeader)
    ).data;
    assert(
      (equipmentsBrands2 as EquipmentBrandDatabaseInterface[]).length === 0
    );
    const equipmentsProperties2 = await (
      await axios.get(databaseUrl + "/equipmentsProperties", databaseHeader)
    ).data;
    assert(
      (equipmentsProperties2 as EquipmentPropertyDatabaseInterface[]).length ===
        0
    );
    const actionsTypes2 = await (
      await axios.get(databaseUrl + "/actionsTypes", databaseHeader)
    ).data;
    assert((actionsTypes2 as ActionTypeDatabaseInterface[]).length === 0);
    const statesDb2 = await (
      await axios.get(databaseUrl + "/states", databaseHeader)
    ).data;
    assert((statesDb2 as StateDatabaseInterface[]).length === 0);
    const paramsDb2 = await (
      await axios.get(databaseUrl + "/params", databaseHeader)
    ).data;
    assert((paramsDb2 as ParamDatabaseInterface[]).length === 0);
    const equipmentsTypesEquipsProps2 = await (
      await axios.get(
        databaseUrl + "/equipmentsTypesEquipmentsProperties",
        databaseHeader
      )
    ).data;
    assert(
      (
        equipmentsTypesEquipsProps2 as EquipmentTypeEquipmentPropertyDatabaseInterface[]
      ).length === 0
    );
    const statesParamsDb2 = await (
      await axios.get(databaseUrl + "/statesParams", databaseHeader)
    ).data;
    assert((statesParamsDb2 as StateParamDatabaseInterface[]).length === 0);
    const actionsTypesParamsDb2 = await (
      await axios.get(databaseUrl + "/actionsTypesParams", databaseHeader)
    ).data;
    assert(
      (actionsTypesParamsDb2 as ActionTypeParamDatabaseInterface[]).length === 0
    );
    const behaviors2 = await (
      await axios.get(databaseUrl + "/behaviors", databaseHeader)
    ).data;
    assert((behaviors2 as BehaviorDatabaseInterface[]).length === 0);
    const behaviorsProperties2 = await (
      await axios.get(databaseUrl + "/behaviorsProperties", databaseHeader)
    ).data;
    assert(
      (behaviorsProperties2 as BehaviorPropertyDatabaseInterface[]).length === 0
    );
    const behaviorsStates2 = await (
      await axios.get(databaseUrl + "/behaviorsStates", databaseHeader)
    ).data;
    assert((behaviorsStates2 as BehaviorStateDatabaseInterface[]).length === 0);
    const behaviorsBehaviorsProperties2 = await (
      await axios.get(
        databaseUrl + "/behaviorsBehaviorsProperties",
        databaseHeader
      )
    ).data;
    assert(
      (
        behaviorsBehaviorsProperties2 as BehaviorBehaviorPropertyDatabaseInterface[]
      ).length === 0
    );
    const brandsStates2 = await (
      await axios.get(databaseUrl + "/brandsStates", databaseHeader)
    ).data;
    assert((brandsStates2 as BrandStateDatabaseInterface[]).length === 0);
    const brandsActionsTypes2 = await (
      await axios.get(databaseUrl + "/brandsActionsTypes", databaseHeader)
    ).data;
    assert(
      (brandsActionsTypes2 as BrandActionTypeDatabaseInterface[]).length === 0
    );
    const userActionResponse = await axios.get(actionUrl);
    const loggedUserActions = userActionResponse.data;
    const createAction = loggedUserActions.find(
      (action: any) =>
        action.actionObject === "system" &&
        action.actionType === "Create" &&
        action.username === "xtvision" && // Replace with the expected username
        action.isSuccessful === true
    );
    assert(createAction !== undefined);

    const updateAction = loggedUserActions.find(
      (action: any) =>
        action.actionObject === "system" &&
        action.actionType === "modify" &&
        action.username === "xtvision" && // Replace with the expected username
        action.isSuccessful === true
    );
    assert(updateAction !== undefined);

    const deleteAction = loggedUserActions.find(
      (action: any) =>
        action.actionObject === "system" &&
        action.actionType === "delete" &&
        action.username === "xtvision" && // Replace with the expected username
        action.isSuccessful === true
    );
    assert(deleteAction !== undefined);

    await clearDatabase();
  });

  it("should find equipment types for one system", async () => {
    await clearDatabase();

    // Create system and equipment types linked
    systemId = (
      (await (
        await axios.post(
          databaseUrl + "/systems",
          newCastelSuiteDb,
          databaseHeader
        )
      ).data) as SystemDatabaseInterface
    ).id;
    await axios.post(
      databaseUrl + "/equipmentsTypes",
      equipmentTypes,
      databaseHeader
    );

    // Check there are 3 for systemId and 0 for another id
    const equipmentsTypes = await (
      await axios.get(url + "/" + systemId + "/equipmentsTypes", header)
    ).data;
    assert(
      (equipmentsTypes as EquipmentTypeDatabaseInterface[]).length ===
        equipmentTypes.length
    );
    const equipmentsTypes2 = await (
      await axios.get(url + "/0/equipmentsTypes", header)
    ).data;
    assert((equipmentsTypes2 as EquipmentTypeDatabaseInterface[]).length === 0);

    await clearDatabase();
  });

  it("should find equipments for one system", async () => {
    await clearDatabase();

    // Create system and equipments linked
    systemId = (
      (await (
        await axios.post(
          databaseUrl + "/systems",
          newCastelSuiteDb,
          databaseHeader
        )
      ).data) as SystemDatabaseInterface
    ).id;
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

    // Check there are 5 for systemId and 0 for another id
    const equipments = await (
      await axios.get(url + "/" + systemId + "/equipments", header)
    ).data;
    assert(
      (equipments as EquipmentDatabaseInterface[]).length ===
        newEquipmentsDb.length
    );
    const equipments2 = await (
      await axios.get(url + "/0/equipments", header)
    ).data;
    assert((equipments2 as EquipmentDatabaseInterface[]).length === 0);

    await clearDatabase();
  });

  it("should filter systems", async () => {
    await clearDatabase();

    // Create a system
    systemId = (
      (await (
        await axios.post(
          databaseUrl + "/systems",
          newCastelSuiteDb,
          databaseHeader
        )
      ).data) as SystemDatabaseInterface
    ).id;

    // Check systems are filtered
    const systems = await (
      await axios.post(url + "/filter", { brand: CASTELSUITE }, header)
    ).data;
    assert((systems as SystemDatabaseInterface[]).length === 1);
    const systems2 = await (
      await axios.post(url + "/filter", { brand: "toto" }, header)
    ).data;
    assert((systems2 as SystemDatabaseInterface[]).length === 0);

    await clearDatabase();
  });

  it("should get brands list of systems", async () => {
    // Get brands list of systems
    const brands = await (await axios.get(url + "/brands", header)).data;
    assert(brands instanceof Array && brands.length !== 0);
  });

  it("should get auth modes list of systems", async () => {
    // Get auth modes list of systems
    const authModes = await (await axios.get(url + "/authModes", header)).data;
    assert(authModes instanceof Array && authModes.length !== 0);
  });
});

async function clearDatabase() {
  await axios.delete(url, header);
}
