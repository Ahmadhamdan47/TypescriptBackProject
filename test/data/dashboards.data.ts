import { NewDashboard } from "../../src/database/interfaces/dashboard.database";

export const newDashboard: NewDashboard = {
  name: "dashboard Test",
  description: "dashboard",
  layout: "{...}",
  widgets: "{...}",
  userIds: [1],
};
