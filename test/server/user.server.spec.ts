import assert from "assert";
import { prefs, customAxios as axios, WebServer } from "../../src/webServer";
import { newUser, newUser2, newUserTest } from "../data/users.data";
import { UserDatabaseInterface } from "../../src/database/interfaces/user.database";
import { WebServerTestOAuth2 } from "./webServerTestOAuth2";
import { httPrefix } from "../../src/server/resources/config";
import { NewRoleUser } from "../../src/database/interfaces/roleUser.database";
import { databaseHeader, header, initPrefsForTests } from "./utilities";

const url = `${httPrefix}:5001/users`;
const actionUrl = `${httPrefix}:5001/database/generalUserActions`;
const databaseUrl = `${httPrefix}:5001/database/users`;

describe("user", function () {
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
  it("should get all users", async () => {
    const id1 = (await axios.post(databaseUrl, newUser, databaseHeader)).data
      .id;
    const id2 = (await axios.post(databaseUrl, newUser2, databaseHeader)).data
      .id;

    prefs.auth_users_url = undefined;
    const response = await axios.get(url, header);
    const users = response.data as UserDatabaseInterface[];
    assert(users.length !== 0);

    await axios.delete(url + "/" + id1, header);
    await axios.delete(url + "/" + id2, header);
    // Await the end of the delete (bug in some env)
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  it("should delete one user", async () => {
    const id = (await axios.post(databaseUrl, newUser, databaseHeader)).data.id;
    prefs.auth_users_url = undefined;
    const res = await axios.delete(url + "/" + id, header);
    assert(res.status === 200);

    // Await the end of the delete (bug in some env)
    await new Promise(resolve => setTimeout(resolve, 1000));
    const userActionResponse = await axios.get(actionUrl);
    const loggedUserActions = userActionResponse.data;
    const deleteAction = loggedUserActions.find(
      (action: any) =>
        action.actionObject === "user" &&
        action.actionType === "delete" &&
        action.username === "xtvision" && // Replace with the expected username
        action.isSuccessful === true
    );
    assert(deleteAction !== undefined);
  });

  it("should create one user", async () => {
    prefs.auth_users_url = undefined;
    const id = (await axios.post(url, newUser2, header)).data.id;
    const response2 = await axios.get(databaseUrl + "/" + id, databaseHeader);
    const user = response2.data;
    assert(user.id === +id);

    await axios.delete(url + "/" + id, header);
    // Await the end of the delete (bug in some env)
    await new Promise(resolve => setTimeout(resolve, 1000));
    const userActionResponse = await axios.get(actionUrl);
    const loggedUserActions = userActionResponse.data;
    const createAction = loggedUserActions.find(
      (action: any) =>
        action.actionObject === "user" &&
        action.actionType === "create" &&
        action.username === "xtvision" && // Replace with the expected username
        action.isSuccessful === true
    );
    assert(createAction !== undefined);
  });

  it("should update one user", async () => {
    const id = (await axios.post(databaseUrl, newUserTest, databaseHeader)).data
      .id;
    newUserTest.description = "after update";
    prefs.auth_users_url = undefined;
    const response2 = await axios.put(url + "/" + id, newUserTest, header);
    assert(response2.status === 200);
    await axios.delete(url + "/" + id, header);
    // Await the end of the delete (bug in some env)
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  it("should associate a user to a role", async () => {
    const body: NewRoleUser = {
      UserId: 1,
      RoleId: 1,
    };
    const responseLinkRole = await axios.post(url + "/linkRoles", body, header);
    assert(responseLinkRole.status === 200);
  });

  it("should associate a user to a managementArea", async () => {
    const body = {
      userId: 1,
      managementAreaId: 1,
    };
    const responseLinkRole = await axios.post(
      url + "/linkManagementAreas",
      body,
      header
    );
    assert(responseLinkRole.status === 200);
  });

  it("should search User by name, roles", async () => {
    //filterByName
    const filterName: any = {
      name: "xtvision",
    };
    const responseSearchName = (
      await axios.post(url + "/filter", filterName, header)
    ).data;
    assert(responseSearchName.length >= 1);

    //filterByRole
    const filterRole: any = {
      Roles: ["Configuration", "Exploitation"],
    };
    const responseSearchRole = (
      await axios.post(url + "/filter", filterRole, header)
    ).data;
    assert(responseSearchRole.length >= 1);
  });
});
