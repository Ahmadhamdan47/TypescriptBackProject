import assert from "assert";
import { customAxios as axios, WebServer } from "../../src/webServer";
import { WebServerTestOAuth2 } from "./webServerTestOAuth2";
import { newRabbitMQDb, newCastelSuiteDb } from "../data/systems.data";
import { equipmentTypes } from "../data/equipmentTypes.data";
import { behavs } from "../data/behaviors.data";
import { newEquipmentsDb } from "../data/equipments.data";
import { WebServerTestRabbitMQ } from "./webServerTestRabbitMQ";
import {
  NotifBindingKeyDatabaseInterface,
  SendingMode,
} from "../../src/database/interfaces/notifBindingKey.database";
import {
  MessageStatus,
  NotifMessageServerInterface,
} from "../../src/server/interfaces/notifMessage.server";
import { NotifBindingKeyServerInterface } from "../../src/server/interfaces/notifBindingKey.server";
import { domain1 } from "../data/domains.data";
import { brandsTypes } from "../data/brands.data";
import { notifBindingKey1 } from "../data/notifBindingKeys.data";
import { EnumScheduledJobsNames } from "../../src/server/jobs/initScheduling.server.job";
import { ScheduledJobDatabaseInterface } from "../../src/database/interfaces/scheduledJob.database";
import { httPrefix } from "../../src/server/resources/config";
import { databaseHeader, header, initPrefsForTests } from "./utilities";

const urlNotifBindingKeys = `${httPrefix}:5001/notifBindingKeys`;
const urlNotifMessages = `${httPrefix}:5001/notifMessages`;
const urlNotifServerStatus = `${httPrefix}:5001/notifServerStatus`;
const databaseUrl = `${httPrefix}:5001/database`;
const actionUrl = `${httPrefix}:5001/database/generalUserActions`;


describe("notif", function () {
  initPrefsForTests();

  const webServer = new WebServer({ port: 5001 });
  const webServerTestOAuth2 = new WebServerTestOAuth2();
  //Mock RabbitMQ server
  const webServerTestRabbitMQ = new WebServerTestRabbitMQ();
  before(async () => {
    await webServerTestOAuth2.start();
    await webServerTestRabbitMQ.start();
    await webServer.start();
  });
  after(async () => {
    await webServer.stop();
    await webServerTestRabbitMQ.stop();
    await webServerTestOAuth2.stop();
  });

  it("should create, 'update' and delete a notif binding key", async () => {
    // Clear database
    await clearDatabase();

    // Create systems and equipments linked
    await axios.post(
      databaseUrl + "/systems",
      newCastelSuiteDb,
      databaseHeader
    );
    await axios.post(databaseUrl + "/systems", newRabbitMQDb, databaseHeader);
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

    // Create notif binding key
    const notifBindingKey: NotifBindingKeyServerInterface = {
      name: "mes potes",
      systemId: 2,
      defaultMessageTtl: 3600 * 24,
      equipmentIds: [3, 4],
      sendingMode: SendingMode.Unique,
    };
    const response0 = await axios.post(
      urlNotifBindingKeys,
      notifBindingKey,
      header
    );
    assert(response0.status === 200);
    const userActionResponse = await axios.get(actionUrl);
    const loggedUserActions = userActionResponse.data;
    const createAction = loggedUserActions.find(
      (action: any) =>
        action.actionObject === "notifBindingKey" &&
        action.actionType === "create" &&
        action.username === "xtvision" && // Replace with the expected username
        action.isSuccessful === true
    );
    assert(createAction !== undefined);


    const notifBindingKey2: NotifBindingKeyServerInterface = {
      name: "mes coupaings",
      systemId: 2,
      defaultMessageTtl: 3600 * 48,
      equipmentIds: [],
      sendingMode: SendingMode.Unique,
    };
    const response1 = await axios.post(
      urlNotifBindingKeys,
      notifBindingKey2,
      header
    );
    assert(response1.status === 200);

    // Get
    const response2 = (await axios.get(urlNotifBindingKeys, header)).data;
    assert(response2[0].name === "mes potes");
    assert(response2[1].name === "mes coupaings");

    let notifBindingKeyId = response2[0].id;

    // Launch request to "rename" the notif binding key created
    const response3 = await axios.put(
      urlNotifBindingKeys + "/" + notifBindingKeyId,
      { name: "mes collegues" },
      header
    );
    assert(response3.status === 200);
    const updateAction = loggedUserActions.find(
      (action: any) =>
        action.actionObject === "notifBindingKey" &&
        action.actionType === "modify" &&
        action.username === "xtvision" && // Replace with the expected username
        action.isSuccessful === true
    );
    assert(updateAction !== undefined);


    // Check if the renaming is OK
    const response4 = (await axios.get(urlNotifBindingKeys, header)).data;
    assert(response4[1].name === "mes collegues");
    notifBindingKeyId = response4[1].id;

    // Launch request to delete the notif binding key
    const response5 = await axios.delete(
      urlNotifBindingKeys + "/" + notifBindingKeyId,
      header
    );
    assert(response5.status === 200);

    const deleteAction = loggedUserActions.find(
      (action: any) =>
        action.actionObject === "notifBindingKey" &&
        action.actionType === "delete" &&
        action.username === "xtvision" && // Replace with the expected username
        action.isSuccessful === true
    );
    assert(deleteAction !== undefined);


    // Check that the tables are empty
    const response6 = (
      await axios.get(databaseUrl + "/notifBindingKeys", databaseHeader)
    ).data;
    assert((response6 as NotifBindingKeyDatabaseInterface[]).length === 1);
    

    await clearDatabase();
  });

  it("should associate equipments to a notif binding key", async () => {
    // Clear database
    await clearDatabase();

    // Create systems and equipments linked
    await axios.post(
      databaseUrl + "/systems",
      newCastelSuiteDb,
      databaseHeader
    );
    await axios.post(databaseUrl + "/systems", newRabbitMQDb, databaseHeader);
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
    await axios.post(
      databaseUrl + "/notifBindingKeys",
      notifBindingKey1,
      databaseHeader
    );

    const equipmentIds = { equipmentIds: [3, 4] };
    const response = await axios.post(
      urlNotifBindingKeys + "/1",
      equipmentIds,
      header
    );
    assert(response.status === 200);
    await clearDatabase();
  });

  it("should save, update and delete a predefined message", async () => {
    // Clear database
    await clearDatabase();

    // Create systems and equipments linked
    await axios.post(
      databaseUrl + "/systems",
      newCastelSuiteDb,
      databaseHeader
    );
    await axios.post(databaseUrl + "/systems", newRabbitMQDb, databaseHeader);
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
    await axios.post(
      databaseUrl + "/notifBindingKeys",
      notifBindingKey1,
      databaseHeader
    );

    // Create messages
    const message: NotifMessageServerInterface = {
      title: "titre1",
      body: "corps1",
      messageTtl: 3600 * 24,
      messageDelay: 0,
      priority: "0",
      sender: "sender",
      notifBindingKeysIds: [],
      enclosed_file: "",
    };
    await axios.post(urlNotifMessages, message, header);

    const message2: NotifMessageServerInterface = {
      title: "titre2",
      body: "corps2",
      messageTtl: 3600 * 48,
      messageDelay: 0,
      priority: "0",
      sender: "sender",
      notifBindingKeysIds: [1],
      enclosed_file: "",
    };

    const response = await axios.post(urlNotifMessages, message2, header);
    assert(response.status === 200);
    const userActionResponse = await axios.get(actionUrl);
    const loggedUserActions = userActionResponse.data;
    const createAction = loggedUserActions.find(
      (action: any) =>
        action.actionObject === "notifMessage" &&
        action.actionType === "create" &&
        action.username === "xtvision" && // Replace with the expected username
        action.isSuccessful === true
    );
    assert(createAction !== undefined);


    // Get notifmessagesnotifbindingkeys
    const notifMessagesNotifBindingKeys = (
      await axios.get(
        databaseUrl + "/notifPredefinedMessageNotifBindingKeys",
        databaseHeader
      )
    ).data;
    assert(notifMessagesNotifBindingKeys.length === 1);

    // Get predefined messages
    const messages = (await axios.get(urlNotifMessages, header)).data;
    assert(messages.length === 2);

    const messageId = messages[0].id;

    // Delete message
    await axios.delete(urlNotifMessages + "/" + messageId, header);

    // Get messages
    const messages2 = (await axios.get(urlNotifMessages, header)).data;
    assert(messages2.length === 1);

    // rename message
    await axios.put(
      urlNotifMessages + "/" + messages2[0].id,
      { title: "titre3" },
      header
    );

    // Get messages
    const messages3 = (await axios.get(urlNotifMessages, header)).data;
    assert(messages3[0].title === "titre3");

    await clearDatabase();
  });

  it("should send and historize a message", async () => {
    // Clear database
    await clearDatabase();

    // Create systems and equipments linked
    await axios.post(
      databaseUrl + "/systems",
      newCastelSuiteDb,
      databaseHeader
    );
    await axios.post(databaseUrl + "/systems", newRabbitMQDb, databaseHeader);
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
    await axios.post(
      databaseUrl + "/notifBindingKeys",
      notifBindingKey1,
      databaseHeader
    );

    const message: NotifMessageServerInterface = {
      title: "titre",
      body: "corps",
      messageTtl: 3600 * 24,
      messageDelay: 0,
      priority: "0",
      sender: "this",
      enclosed_file: "(null)",
      notifBindingKeysIds: [1],
    };
    const response = (
      await axios.post(urlNotifMessages + "/send", message, header)
    ).data;
    assert(response[0] === true);

    // check if the message is in the historized database
    const historizedMessages = (
      await axios.get(urlNotifMessages + "/history", header)
    ).data;

    assert(historizedMessages.length === 1);

    await clearDatabase();
  });

  it("should delay and cancel a message", async () => {
    // Clear database
    await clearDatabase();

    // Create systems and equipments linked
    await axios.post(
      databaseUrl + "/systems",
      newCastelSuiteDb,
      databaseHeader
    );
    await axios.post(databaseUrl + "/systems", newRabbitMQDb, databaseHeader);
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
    await axios.post(
      databaseUrl + "/notifBindingKeys",
      notifBindingKey1,
      databaseHeader
    );

    const message: NotifMessageServerInterface = {
      title: "titre",
      body: "corps",
      messageTtl: 3600 * 24,
      messageDelay: 30,
      priority: "0",
      sender: "this",
      enclosed_file: "(null)",
      notifBindingKeysIds: [1],
    };
    const response = await axios.post(
      urlNotifMessages + "/delay",
      message,
      header
    );
    assert(response.status === 200);

    // check if the message is in the historized database
    const historizedMessages = (
      await axios.get(urlNotifMessages + "/history", header)
    ).data;
    assert(historizedMessages.length === 1);
    assert(historizedMessages[0].status === MessageStatus.Delayed);

    // check if the message is in the scheduled jobs database
    const scheduledMessages = (
      await axios.get(databaseUrl + "/scheduledJobs", databaseHeader)
    ).data;
    assert(scheduledMessages.length === 2);

    // get the job id
    const messageJobId = scheduledMessages.find(
      (job: ScheduledJobDatabaseInterface) =>
        job.task === EnumScheduledJobsNames.sendScheduledMessage
    ).id;

    // cancel the message
    const response2 = await axios.delete(
      urlNotifMessages +
        "/delay/" +
        messageJobId +
        "/" +
        historizedMessages[0].id,
      header
    );
    assert(response2.status === 200);
    const userActionResponse = await axios.get(actionUrl);
    const loggedUserActions = userActionResponse.data;
    const deleteAction = loggedUserActions.find(
      (action: any) =>
        action.actionObject === "notiMessage" &&
        action.actionType === "delete" &&
        action.username === "xtvision" && // Replace with the expected username
        action.isSuccessful === true
    );
    assert(deleteAction !== undefined);


    // check if the message was deleted from the scheduled jobs database
    const scheduledMessages2 = (
      await axios.get(databaseUrl + "/scheduledJobs", databaseHeader)
    ).data;
    assert(scheduledMessages2.length === 1);

    // check if the message is modified in the historized database
    const historizedMessages2 = (
      await axios.get(urlNotifMessages + "/history", header)
    ).data;
    assert(historizedMessages2[0].status === MessageStatus.Canceled);

    await clearDatabase();
  });

  it("should get the connections list in a rabbitmq server", async () => {
    await clearDatabase();

    // Create RabbitMQ system
    await axios.post(databaseUrl + "/systems", newRabbitMQDb, databaseHeader);

    const users = (
      await axios.get(urlNotifServerStatus + "/" + newRabbitMQDb.id, header)
    ).data;
    assert(users.length === 2);

    await clearDatabase();
  });

  /* 
  THIS TEST IS USED TO TEST THE DELETE MESSAGE FUNCTIONALITY IN RABBITMQ SERVER
  I COMMENT IT BECAUSE IT IS NOT A UNIT TEST AND IT IS NOT NECESSARY TO RUN IT 
  EVERY TIME BUT ONLY WHEN WE WANT TO TEST THE DELETE FUNCTIONALITY
  it.only("should delete a message in RabbitMQ server", async () => {
    const queueName = "user3";
    const messageId = "0";

    const connection = await amqplib.connect("amqp://" + "10.49.25.13:5672", {
      credentials: amqplib.credentials.plain("admin", "admin"),
    });

    const channel = await connection.createChannel();

    let messageFound = false;
    while (!messageFound) {
      await channel.consume(queueName, (message) => {
        if (message !== null) {
          if (message.properties.messageId !== messageId) {
            channel.nack(message, false, true);
          } else {
            messageFound = true;
            channel.ack(message);
          }
        }
      });
    }
    await channel.close();
    await connection.close();
  }); */
});

async function clearDatabase() {
  await axios.delete(`${httPrefix}:5001/systems`, header);
  await axios.delete(databaseUrl + "/notifPredefinedMessages", databaseHeader);
  await axios.delete(databaseUrl + "/notifHistorizedMessages", databaseHeader);
}