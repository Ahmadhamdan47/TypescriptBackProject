import express from "express";
import { Server } from "http";
import { dashboardDatabaseController } from "./controllers/dashboard.database.controller";
import { featureDatabaseController } from "./controllers/feature.database.controller";
import { managementAreaDatabaseController } from "./controllers/managementArea.database.controller";
import { roleDatabaseController } from "./controllers/role.database.controller";
import { systemDatabaseController } from "./controllers/system.database.controller";
import { userDatabaseController } from "./controllers/user.database.controller";
import { databaseController } from "./controllers/database.controller";
import { equipmentDatabaseController } from "./controllers/equipment.database.controller";
import { actionTypeDatabaseController } from "./controllers/actionType.database.controller";
import { eventDatabaseController } from "./controllers/event.database.controller";
import { equipmentTypeDatabaseController } from "./controllers/equipmentType.database.controller";
import { stateDatabaseController } from "./controllers/state.database.controller";
import { paramDatabaseController } from "./controllers/param.database.controller";
import { actionTypeParamDatabaseController } from "./controllers/actionTypeParam.database.controller";
import { stateParamDatabaseController } from "./controllers/stateParam.database.controller";
import { xtvisionEquipmentConfigDatabaseController } from "./controllers/xtvisionEquipmentConfig.database.controller";
import { behaviorDatabaseController } from "./controllers/behavior.database.controller";
import { behaviorStateDatabaseController } from "./controllers/behaviorState.database.controller";
import { behaviorPropertyDatabaseController } from "./controllers/behaviorProperty.database.controller";
import { equipmentPropertyDatabaseController } from "./controllers/equipmentProperty.database.controller";
import { equipmentTypeEquipmentPropertyDatabaseController } from "./controllers/equipmentTypeEquipmentProperty.database.controller";
import { notifBindingKeyDatabaseController } from "./controllers/notifBindingKey.database.controller";
import { notifPredefinedMessageDatabaseController } from "./controllers/notifPredefinedMessage.database.controller";
import { equipmentNotifBindingKeyDatabaseController } from "./controllers/equipmentNotifBindingKey.database.controller";
import { behaviorBehaviorPropertyDatabaseController } from "./controllers/behaviorBehaviorProperty.database.controller";
import { currentEquipmentStateDatabaseController } from "./controllers/currentEquipmentState.database.controller";
import { domainDatabaseController } from "./controllers/domain.database.controller";
import { brandActionTypeDatabaseController } from "./controllers/brandActionType.database.controller";
import { brandStateDatabaseController } from "./controllers/brandState.database.controller";
import { equipmentBrandDatabaseController } from "./controllers/equipmentBrand.database.controller";
import { applicationParametersDatabaseController } from "./controllers/applicationParameters.database.controller";
import { notifPredefinedMessageNotifBindingKeyDatabaseController } from "./controllers/notifPredefinedMessageNotifBindingKey.database.controller";
import { notifHistorizedMessageDatabaseController } from "./controllers/notifHistorizedMessage.database.controller";
import { scheduledJobsDatabaseController } from "./controllers/scheduledJobs.database.controller";
import { authenticationParametersDatabaseController } from "./controllers/authenticationParameters.database.controller";
import { dashboardUserDatabaseController } from "./controllers/dashboardUser.database.controller";
import { generalUserActionDatabaseController } from "./controllers/generalUserAction.database.controller";
import { roleUserDatabaseController } from "./controllers/roleUser.database.controller";
import { managementareaUserDatabaseController } from "./controllers/managementAreaUser.database.controller";
import { securityUserActionDatabaseController } from "./controllers/securityUserAction.database.controller";
import { roleFeatureDatabaseController } from "./controllers/roleFeature.database.controller";

export const api = (server: Server) => {
  const app = express.Router();

  app.use(
    "/database/users",
    userDatabaseController(server) // #swagger.tags = ['USERS']
  );
  app.use(
    "/database/dashboards",
    dashboardDatabaseController(server) // #swagger.tags = ['DASHBOARDS']
  );
  app.use(
    "/database/dashboardsUsers",
    dashboardUserDatabaseController(server) // #swagger.tags = ['DASHBOARDS USERS']
  );
  app.use(
    "/database/features",
    featureDatabaseController(server) // #swagger.tags = ['FEATURES']
  );
  app.use(
    "/database/managementAreas",
    managementAreaDatabaseController(server) // #swagger.tags = ['MANAGEMENT AREAS']
  );
  app.use(
    "/database/managementAreasUsers",
    managementareaUserDatabaseController(server) // #swagger.tags = ['MANAGEMENT AREAS USERS']
  );
  app.use(
    "/database/roles",
    roleDatabaseController(server) // #swagger.tags = ['ROLES']
  );
  app.use(
    "/database/rolesUsers",
    roleUserDatabaseController(server) // #swagger.tags = ['ROLES USERS']
  );
  app.use(
    "/database/rolesFeatures",
    roleFeatureDatabaseController(server) // #swagger.tags = ['ROLES FEATURES']
  );
  app.use(
    "/database/systems",
    systemDatabaseController(server) // #swagger.tags = ['SYSTEMS']
  );
  app.use("/database/equipments", equipmentDatabaseController(server)); // #swagger.tags = ['EQUIPMENTS']
  app.use(
    "/database/notifBindingKeys",
    notifBindingKeyDatabaseController(server)
  ); // #swagger.tags = ['NOTIF BINDING KEYS']
  app.use(
    "/database/notifPredefinedMessages",
    notifPredefinedMessageDatabaseController(server)
  ); // #swagger.tags = ['NOTIF PREDEFINED MESSAGES']
  app.use(
    "/database/notifHistorizedMessages",
    notifHistorizedMessageDatabaseController(server)
  ); // #swagger.tags = ['NOTIF HISTORIZED MESSAGES']
  app.use(
    "/database/equipmentsNotifBindingKeys",
    equipmentNotifBindingKeyDatabaseController(server)
  ); // #swagger.tags = ['EQUIPMENT NOTIF BINDING KEYS']
  app.use(
    "/database/notifPredefinedMessageNotifBindingKeys",
    notifPredefinedMessageNotifBindingKeyDatabaseController(server)
  ); // #swagger.tags = ['NOTIF PREDEFINED MESSAGE NOTIF BINDING KEYS']
  app.use(
    "/database/currentEquipmentStates",
    currentEquipmentStateDatabaseController(server)
  ); // #swagger.tags = ['CURRENT EQUIPMENT STATES']
  app.use("/database/behaviors", behaviorDatabaseController(server)); // #swagger.tags = ['BEHAVIORS']
  app.use(
    "/database/behaviorsProperties",
    behaviorPropertyDatabaseController(server)
  ); // #swagger.tags = ['BEHAVIORS PROPERTIES']
  app.use("/database/behaviorsStates", behaviorStateDatabaseController(server)); // #swagger.tags = ['BEHAVIORS STATES']
  app.use(
    "/database/behaviorsBehaviorsProperties",
    behaviorBehaviorPropertyDatabaseController(server)
  ); // #swagger.tags = ['BEHAVIORS BEHAVIORS PROPERTIES']
  app.use(
    "/database/xtvisionEquipmentConfigs",
    xtvisionEquipmentConfigDatabaseController(server)
  ); // #swagger.tags = ['XTVISION EQUIPMENT CONFIG']
  app.use("/database/actionsTypes", actionTypeDatabaseController(server)); // #swagger.tags = ['ACTION TYPES']
  app.use(
    "/database/brandsActionsTypes",
    brandActionTypeDatabaseController(server)
  ); // #swagger.tags = ['BRANDS ACTION TYPES']
  app.use(
    "/database/equipmentsProperties",
    equipmentPropertyDatabaseController(server)
  ); // #swagger.tags = ['EQUIPMENTS PROPERTIES']
  app.use("/database/equipmentsTypes", equipmentTypeDatabaseController(server)); // #swagger.tags = ['EQUIPMENT TYPES']
  app.use(
    "/database/equipmentsBrands",
    equipmentBrandDatabaseController(server)
  ); // #swagger.tags = ['EQUIPMENTS BRANDS']
  app.use("/database/domains", domainDatabaseController(server)); // #swagger.tags = ['DOMAINS']
  app.use("/database/states", stateDatabaseController(server)); // #swagger.tags = ['STATES']
  app.use("/database/brandsStates", brandStateDatabaseController(server)); // #swagger.tags = ['BRANDS STATES']
  app.use("/database/events", eventDatabaseController(server)); // #swagger.tags = ['EVENTS']
  app.use("/database/params", paramDatabaseController(server)); // #swagger.tags = ['PARAMS']
  app.use(
    "/database/equipmentsTypesEquipmentsProperties",
    equipmentTypeEquipmentPropertyDatabaseController(server)
  ); // #swagger.tags = ['EQUIPMENT TYPES EQUIPMENTS PROPERTIES']
  app.use(
    "/database/actionsTypesParams",
    actionTypeParamDatabaseController(server)
  ); // #swagger.tags = ['ACTION TYPES PARAMS']
  app.use("/database/statesParams", stateParamDatabaseController(server)); // #swagger.tags = ['STATES PARAMS']
  app.use(
    "/database/setup",
    databaseController(server) // #swagger.tags = ['SETUP']
  );
  app.use(
    "/database/applicationParameters",
    applicationParametersDatabaseController(server)
  ); // #swagger.tags = ['APPLICATION PARAMETERS']
  app.use(
    "/database/authenticationParameters",
    authenticationParametersDatabaseController(server)
  ); // #swagger.tags = ['AUTHENTICATION PARAMETERS']
  app.use("/database/scheduledJobs", scheduledJobsDatabaseController(server)); // #swagger.tags = ['SCHEDULED JOBS']
  app.use(
    "/database/generalUserActions",
    generalUserActionDatabaseController(server)
  ); // #swagger.tags = ['GENERAL USERS ACTIONS']
  app.use(
    "/database/securityUserActions",
    securityUserActionDatabaseController(server)
  ); // #swagger.tags = ['SECURITY USERS ACTIONS']
  return app;
};
