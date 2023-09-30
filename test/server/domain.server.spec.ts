import assert from "assert";
import { customAxios as axios, WebServer } from "../../src/webServer";
import { WebServerTestOAuth2 } from "./webServerTestOAuth2";
import { newCastelSuiteDb } from "../data/systems.data";
import { equipmentTypes } from "../data/equipmentTypes.data";
import { behavs } from "../data/behaviors.data";
import { domain1 } from "../data/domains.data";
import { newEquipmentsDb } from "../data/equipments.data";
import { DomainDatabaseInterface } from "../../src/database/interfaces/domain.database";
import { brandsTypes } from "../data/brands.data";
import { httPrefix } from "../../src/server/resources/config";
import { databaseHeader, header, initPrefsForTests } from "./utilities";

const url = `${httPrefix}:5001`;
const databaseUrl = `${httPrefix}:5001/database`;

describe("domain", function () {
  initPrefsForTests();

  const webServer = new WebServer({ port: 5001 });
  const webServerTestOAuth2 = new WebServerTestOAuth2();
  before(async () => {
    await webServerTestOAuth2.start();
    await webServer.start();
  });
  after(async () => {
    await webServer.stop();
    await webServerTestOAuth2.stop();
  });

  it("should get all domains", async () => {
    // Clear database
    await axios.delete(url + "/systems", header);

    // Create system, equipment types, equipments, xtvision equipments configs and domains linked
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

    const domains = (await axios.get(url + "/domains", header))
      .data as DomainDatabaseInterface[];
    assert(domains.length === 1);

    // Clear database
    await axios.delete(url + "/systems", header);
  });
});
