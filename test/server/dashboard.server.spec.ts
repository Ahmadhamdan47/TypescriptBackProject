import assert from "assert";
import { customAxios as axios, WebServer } from "../../src/webServer";
import { newDashboard } from "../data/dashboards.data";
import { WebServerTestOAuth2 } from "./webServerTestOAuth2";
import { httPrefix } from "../../src/server/resources/config";
import { databaseHeader, header, initPrefsForTests } from "./utilities";

const url = `${httPrefix}:5001/dashboards`;
const databaseUrl = `${httPrefix}:5001/database/dashboards`;
const dashboardUsersDatabaseUrl = `${httPrefix}:5001/database/dashboardsUsers`;

describe("dashboard", function () {
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

  it("should create, update and delete one dashboard", async () => {
    // clear database
    await axios.delete(databaseUrl, databaseHeader);

    // create
    const responseCreate = (await axios.post(url, newDashboard, header)).data
      .id;
    assert(responseCreate > 0);

    // update
    const responseUpdate = await axios.put(
      url + "/" + responseCreate,
      { name: "test" },
      header
    );
    assert(responseUpdate.status === 200);

    // get dashboard
    const responseGet = (await axios.get(url + "/" + responseCreate, header))
      .data;
    assert(responseGet.name === "test");

    // get dashboardusers
    const responseGetDashboardUsers = (
      await axios.get(dashboardUsersDatabaseUrl, databaseHeader)
    ).data;
    assert(responseGetDashboardUsers.length === 1);

    // delete
    const responseDelete = await axios.delete(
      url + "/" + responseCreate,
      header
    );
    assert(responseDelete.status === 200);

    // get dashboards to verify database is empty
    const responseGetAll = await axios.get(url, header);
    assert(responseGetAll.data.length === 0);
  });
});
