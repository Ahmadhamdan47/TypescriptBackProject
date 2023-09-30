import assert from "assert";
import { customAxios as axios, WebServer } from "../../src/webServer";
import { events } from "../data/events.data";
import { EventDatabaseInterface } from "../../src/database/interfaces/event.database";
import { WebServerTestOAuth2 } from "./webServerTestOAuth2";
import { httPrefix } from "../../src/server/resources/config";
import { databaseHeader, header, initPrefsForTests } from "./utilities";

const url = `${httPrefix}:5001/events`;
const databaseUrl = `${httPrefix}:5001/database/events`;

describe("event", function () {
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

  it("should find events with filters", async () => {
    // Clear database
    await axios.delete(databaseUrl, databaseHeader);

    // Create events
    await axios.post(databaseUrl, events, databaseHeader);

    const eventsFiltered1 = (
      await axios.post(
        url + "/filter",
        {
          equipmentName: "247",
        },
        header
      )
    ).data as EventDatabaseInterface[];
    assert(eventsFiltered1.length === 3);

    const eventsFiltered2 = (
      await axios.post(
        url + "/filter",
        {
          equipmentName: "247",
          stateName: "Stop call",
        },
        header
      )
    ).data as EventDatabaseInterface[];
    assert(eventsFiltered2.length === 2);

    const eventsFiltered3 = (
      await axios.post(
        url + "/filter",
        {
          equipmentProperty: "DOOR",
        },
        header
      )
    ).data as EventDatabaseInterface[];
    assert(eventsFiltered3.length === 1);

    const eventsFiltered4 = (
      await axios.post(
        url + "/filter",
        {
          timestamp: new Date("2022-03-01"),
        },
        header
      )
    ).data as EventDatabaseInterface[];
    assert(eventsFiltered4.length === 4);

    const eventsFiltered5 = (
      await axios.post(
        url + "/filter",
        {
          timestamp: new Date("2022-03-01"),
          equipmentProperty: "SERVER",
        },
        header
      )
    ).data as EventDatabaseInterface[];
    assert(eventsFiltered5.length === 1);
  });
});
