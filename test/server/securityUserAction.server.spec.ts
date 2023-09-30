import assert from "assert";
import { prefs, customAxios as axios, WebServer } from "../../src/webServer";
import { WebServerTestOAuth2 } from "./webServerTestOAuth2";
import { httPrefix } from "../../src/server/resources/config";
import { databaseHeader, header, initPrefsForTests } from "./utilities";
import { securityUserAction } from "../data/securityUserAction.data";
const databaseUrl = `${httPrefix}:5001/database/securityUserActions`;

describe("securityUserAction", function () {
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

  it("should log user action", async () => {
    const response = await axios.post(
      databaseUrl,
      securityUserAction,
      databaseHeader
    );
    assert.strictEqual(response.status, 201);
  });

  it("should retrieve security user actions", async () => {
    const response = await axios.get(databaseUrl, header);
    assert.strictEqual(response.status, 200);

    const dataFromDatabase = response.data;
    assert.strictEqual(Array.isArray(dataFromDatabase), true, "Response data should be an array");
  });

  it("should retrieve security user actions by filters", async () => {
    const filters = { username: "test user" };

    const response = await axios.post(
      `${databaseUrl}/filter`,
      filters,
      databaseHeader
    );
    assert.strictEqual(response.status, 200);

    const dataFromDatabase = response.data;
    assert.strictEqual(Array.isArray(dataFromDatabase), true, "Response data should be an array");
  });

  // Add more test cases for other routes if necessary
});
