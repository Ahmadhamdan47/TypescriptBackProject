import express from "express";
import { Server } from "http";
import { featureServerController } from "./controllers/feature.server.controller";
import { dashboardServerController } from "./controllers/dashboard.server.controller";
import { homeServerController } from "./controllers/home.server.controller";
import { roleServerController } from "./controllers/role.server.controller";
import { userServerController } from "./controllers/user.server.controller";
import { managementAreaServerController } from "./controllers/managementArea.server.controller";
import { categoryServerController } from "./controllers/category.server.controller";
import { licenseServerController } from "./controllers/license.server.controller";
import { systemServerController } from "./controllers/system.server.controller";
import { behaviorServerController } from "./controllers/behavior.server.controller";
import { equipmentServerController } from "./controllers/equipment.server.controller";
import { eventServerController } from "./controllers/event.server.controller";
import { notifBindingKeyServerController } from "./controllers/notifBindingKey.server.controller";
import { notifMessageServerController } from "./controllers/notifMessage.server.controller";
import { actionUserServerController } from "./controllers/actionUser.server.controller";
import { equipmentTypeServerController } from "./controllers/equipmentType.server.controller";
import { xtvisionEquipmentConfigServerController } from "./controllers/xtvisionEquipmentConfig.server.controller";
import { logServerController } from "./controllers/log.server.controller";
import { databaseServerController } from "./controllers/database.server.controller";
import { domainServerController } from "./controllers/domain.server.controller";
import { equipmentBrandServerController } from "./controllers/equipmentBrand.server.controller";
import { notifServerStatusServerController } from "./controllers/notifServerStatus.server.controller";
import { applicationParametersServerController } from "./controllers/applicationParameters.server.controller";
import { scheduledJobsServerController } from "./controllers/scheduledJob.server.controller";
import { authenticationParametersServerController } from "./controllers/authenticationParameters.server.controller";

export const api = (server: Server) => {
  const app = express.Router();

  app.use(
    "/home",
    homeServerController(server) // #swagger.tags = ['HOME']
  );
  app.use(
    "/logs",
    logServerController(server) // #swagger.tags = ['LOGS']
  );
  app.use(
    "/users",
    userServerController(server) // #swagger.tags = ['USERS']
  );
  app.use(
    "/features",
    featureServerController(server) // #swagger.tags = ['FEATURES']
  );
  app.use(
    "/dashboards",
    dashboardServerController(server) // #swagger.tags = ['DASHBOARDS']
  );
  app.use(
    "/roles",
    roleServerController(server) // #swagger.tags = ['ROLES']
  );
  app.use(
    "/managementAreas",
    managementAreaServerController(server) // #swagger.tags = ['MANAGEMENT AREAS']
  );
  app.use(
    "/categories",
    categoryServerController(server) // #swagger.tags = ['CATEGORIES']
  );
  app.use(
    "/licenses",
    licenseServerController(server) // #swagger.tags = ['LICENCES']
  );
  app.use(
    "/systems",
    systemServerController(server) // #swagger.tags = ['SYSTEMS']
  );
  app.use(
    "/modelPoints",
    behaviorServerController(server) // #swagger.tags = ['BEHAVIORS']
  );
  app.use("/equipments", equipmentServerController(server)); // #swagger.tags = ['EQUIPMENTS']
  app.use(
    "/xtvisionEquipmentConfigs",
    xtvisionEquipmentConfigServerController(server) // #swagger.tags = ['XTVISION EQUIPMENTS CONFIGS']
  );
  app.use(
    "/equipmentsTypes",
    equipmentTypeServerController(server) // #swagger.tags = ['EQUIPMENT TYPES']
  );
  app.use(
    "/equipmentsBrands",
    equipmentBrandServerController(server) // #swagger.tags = ['EQUIPMENTS BRANDS']
  );
  app.use(
    "/events",
    eventServerController(server) // #swagger.tags = ['EVENTS']
  );
  app.use(
    "/notifBindingKeys",
    notifBindingKeyServerController(server) // #swagger.tags = ['NOTIF BINDING KEYS']
  );
  app.use(
    "/notifMessages",
    notifMessageServerController(server) // #swagger.tags = ['NOTIF MESSAGES']
  );
  app.use(
    "/notifServerStatus",
    notifServerStatusServerController(server) // #swagger.tags = ['NOTIF SERVER STATUS']
  );
  app.use(
    "/actionUsers",
    actionUserServerController(server) // #swagger.tags = ['ACTION USERS']
  );
  app.use(
    "/domains",
    domainServerController(server) // #swagger.tags = ['DOMAINS']
  );
  app.use(
    "/databases",
    databaseServerController(server) // #swagger.tags = ['DATABASE']
  );
  app.use(
    "/applicationParameters",
    applicationParametersServerController(server) // #swagger.tags = ['APPLICATION PARAMETERS']
  );
  app.use(
    "/authenticationParameters",
    authenticationParametersServerController(server) // #swagger.tags = ['AUTHENTICATION PARAMETERS']
  );
  app.use(
    "/scheduledJobs",
    scheduledJobsServerController(server) // #swagger.tags = ['SCHEDULED JOBS']
  );

  return app;
};
