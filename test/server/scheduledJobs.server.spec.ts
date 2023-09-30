import assert from "assert";
import { customAxios as axios, WebServer } from "../../src/webServer";
import { WebServerTestOAuth2 } from "./webServerTestOAuth2";
import { NewScheduledJob } from "../../src/database/interfaces/scheduledJob.database";
import { httPrefix } from "../../src/server/resources/config";
import { header, initPrefsForTests } from "./utilities";

const urlScheduledJobs = `${httPrefix}:5001/scheduledJobs`;
const actionUrl = `${httPrefix}:5001/database/generalUserActions`;

describe("scheduled jobs", function () {
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

  it("should create and delete a scheduled job", async () => {
    // create a scheduled job
    const newJob: NewScheduledJob = {
      name: "custom daily backup",
      description: "Backup databases everyday at 00:00",
      task: "backupDatabases",
      cron: "0 0 * * *",
      active: true,
    };
    const response = await axios.post(urlScheduledJobs, newJob, header);
    assert(response.status === 200);
    const scheduledJobId = response.data.id;

    // delete the scheduled job
    const response2 = await axios.delete(
      urlScheduledJobs + "/" + scheduledJobId,
      header
    );
    assert(response2.status === 200);

    // Check if the job is deleted
    const response3 = (await axios.get(urlScheduledJobs, header)).data;
    assert(response3.length === 1);
  });

  it("should deactivate and reactivate a scheduled job", async () => {
    // Get jobs
    const response = (await axios.get(urlScheduledJobs, header)).data;
    assert(response.length === 1);
    const scheduledJobId = response[0].id;

    // Launch request to "deactivate" the backup databases job
    const response2 = await axios.put(
      urlScheduledJobs + "/" + scheduledJobId,
      { active: false },
      header
    );
    assert(response2.status === 200);

    // Check if the deactivation is OK
    const response3 = (await axios.get(urlScheduledJobs, header)).data;
    assert(response3[0].active === false);

    // Launch request to "reactivate" the backup databases job
    const response4 = await axios.put(
      urlScheduledJobs + "/" + scheduledJobId,
      { active: true },
      header
    );
    assert(response4.status === 200);

    // Check if the reactivation is OK
    const response5 = (await axios.get(urlScheduledJobs, header)).data;
    assert(response5[0].active === true);
  });
});
