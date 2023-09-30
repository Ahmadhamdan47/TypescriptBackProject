import assert from "assert";
import { customAxios as axios, WebServer } from "../../src/webServer";
import { WebServerTestOAuth2 } from "./webServerTestOAuth2";
import { AuthenticationParametersServerInterface } from "../../src/server/interfaces/authenticationParameters.server";
import { httPrefix } from "../../src/server/resources/config";
import { header, initPrefsForTests } from "./utilities";

const url = `${httPrefix}:5001`;

describe("Parameter", function () {
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

  it("should get application parameters", async () => {
    const applicationParameters = (
      await axios.get(url + "/applicationParameters", header)
    ).data;
    assert(applicationParameters.value);
    assert(applicationParameters.counter);
  });

  it("should get and update authentication parameters", async () => {
    let authenticationParameters = (
      await axios.get(url + "/authenticationParameters", header)
    ).data as AuthenticationParametersServerInterface;

    assert(authenticationParameters.mode);

    await axios.put(
      url + "/authenticationParameters",
      { client_id: "xtvision", client_secret: "xtvision" },
      header
    );

    authenticationParameters = (
      await axios.get(url + "/authenticationParameters", header)
    ).data as AuthenticationParametersServerInterface;

    assert(authenticationParameters.client_id === "xtvision");
    assert(authenticationParameters.client_secret !== "xtvision");
  });
});
