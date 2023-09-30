import SequelizeConnection from "../config/sequelizeConnection";
import { User } from "./user.model";
import { Dashboard } from "./dashboard.model";
import { Role } from "./role.model";
import { System } from "./system.model";
import { ManagementArea } from "./managementArea.model";
import { Feature } from "./feature.model";
import { Equipment } from "./equipment.model";
import { ActionType } from "./actionType.model";
import { Event } from "./event.model";
import { EquipmentType } from "./equipmentType.model";
import { State } from "./state.model";
import { Param } from "./param.model";
import { ActionTypeParam } from "./actionTypeParam.model";
import { StateParam } from "./stateParam.model";
import { XtvisionEquipmentConfig } from "./xtvisionEquipmentConfig.model";
import { Behavior } from "./behavior.model";
import { BehaviorState } from "./behaviorState.model";
import { BehaviorBehaviorProperty } from "./behaviorBehaviorProperty.model";
import { MigrationDbConfig } from "./migrationDbConfig.model";
import { MigrationDbExploit } from "./migrationDbExploit.model";
import { MigrationDbSystem } from "./migrationDbSystem.model";
import { EquipmentProperty } from "./equipmentProperty.model";
import { EquipmentTypeEquipmentProperty } from "./equipmentTypeEquipmentProperty.model";
import { BehaviorProperty } from "./behaviorProperty.model";
import { CurrentEquipmentState } from "./currentEquipmentState.model";
import { NotifBindingKey } from "./notifBindingKey.model";
import { NotifPredefinedMessage } from "./notifPredefinedMessage.model";
import { EquipmentNotifBindingKey } from "./equipmentNotifBindingKey.model";
import { Domain } from "./domain.model";
import { GeneralUserAction } from "./generalUserAction.model";
import { BrandState } from "./brandState.model";
import { BrandActionType } from "./brandActionType.model";
import { EquipmentBrand } from "./equipmentBrand.model";
import { ApplicationParameter } from "./applicationParameters.model";
import { NotifPredefinedMessageNotifBindingKey } from "./notifPredefinedMessageNotifBindingKey.model";
import { NotifHistorizedMessage } from "./notifHistorizedMessage.model";
import { ScheduledJob } from "./scheduledJobs.model";
import { AuthenticationParameter } from "./authenticationParameters.model";
import { DashboardUser } from "./dashboardUser.model";
import { RoleUser } from "./roleUser.model";
import { ManagementAreaUser } from "./managementAreaUser.model";
import { SecurityUserAction } from "./securityUserAction.model";
import { RoleFeature } from "./roleFeature.model";

// The order used here is not alphabetical but is the order to create and link the tables between them
const sequelizeDbConfig = SequelizeConnection.getInstance()[0];
const sequelizeDbExploit = SequelizeConnection.getInstance()[1];
const sequelizeDbSystem = SequelizeConnection.getInstance()[2];

// init models
// config
User.initModel(sequelizeDbConfig);
Dashboard.initModel(sequelizeDbConfig);
DashboardUser.initModel(sequelizeDbConfig);
Role.initModel(sequelizeDbConfig);
RoleUser.initModel(sequelizeDbConfig);
ManagementArea.initModel(sequelizeDbConfig);
ManagementAreaUser.initModel(sequelizeDbConfig);
Feature.initModel(sequelizeDbConfig);
RoleFeature.initModel(sequelizeDbConfig);
System.initModel(sequelizeDbConfig);
EquipmentType.initModel(sequelizeDbConfig);
EquipmentBrand.initModel(sequelizeDbConfig);
Domain.initModel(sequelizeDbConfig);
Equipment.initModel(sequelizeDbConfig);
XtvisionEquipmentConfig.initModel(sequelizeDbConfig);
NotifBindingKey.initModel(sequelizeDbConfig);
NotifPredefinedMessage.initModel(sequelizeDbConfig);
EquipmentNotifBindingKey.initModel(sequelizeDbConfig);
NotifPredefinedMessageNotifBindingKey.initModel(sequelizeDbConfig);
EquipmentProperty.initModel(sequelizeDbConfig);
EquipmentTypeEquipmentProperty.initModel(sequelizeDbConfig);
State.initModel(sequelizeDbConfig);
BrandState.initModel(sequelizeDbConfig);
ActionType.initModel(sequelizeDbConfig);
BrandActionType.initModel(sequelizeDbConfig);
Param.initModel(sequelizeDbConfig);
ActionTypeParam.initModel(sequelizeDbConfig);
StateParam.initModel(sequelizeDbConfig);
Behavior.initModel(sequelizeDbConfig);
BehaviorProperty.initModel(sequelizeDbConfig);
BehaviorState.initModel(sequelizeDbConfig);
BehaviorBehaviorProperty.initModel(sequelizeDbConfig);
CurrentEquipmentState.initModel(sequelizeDbConfig);
ApplicationParameter.initModel(sequelizeDbConfig);
AuthenticationParameter.initModel(sequelizeDbConfig);
MigrationDbConfig.initModel(sequelizeDbConfig);
ScheduledJob.initModel(sequelizeDbConfig);
// exploit
NotifHistorizedMessage.initModel(sequelizeDbExploit);
MigrationDbExploit.initModel(sequelizeDbExploit);
Event.initModel(sequelizeDbExploit);

//System
GeneralUserAction.initModel(sequelizeDbSystem);
SecurityUserAction.initModel(sequelizeDbSystem);
MigrationDbSystem.initModel(sequelizeDbSystem);

// associate models
User.associateModel();
Dashboard.associateModel();
Role.associateModel();
ManagementArea.associateModel();
Feature.associateModel();
System.associateModel();
EquipmentType.associateModel();
EquipmentBrand.associateModel();
Domain.associateModel();
Equipment.associateModel();
XtvisionEquipmentConfig.associateModel();
NotifBindingKey.associateModel();
NotifPredefinedMessage.associateModel();
EquipmentProperty.associateModel();
State.associateModel();
ActionType.associateModel();
Param.associateModel();
Behavior.associateModel();
BehaviorProperty.associateModel();
BehaviorState.associateModel();
CurrentEquipmentState.associateModel();

export const db = {
  sequelizeDbConfig,
  sequelizeDbExploit,
  sequelizeDbSystem,
  User,
  Dashboard,
  DashboardUser,
  Role,
  RoleUser,
  ManagementArea,
  ManagementAreaUser,
  Feature,
  RoleFeature,
  System,
  EquipmentType,
  EquipmentBrand,
  Domain,
  XtvisionEquipmentConfig,
  Equipment,
  EquipmentProperty,
  NotifBindingKey,
  NotifPredefinedMessage,
  NotifHistorizedMessage,
  EquipmentNotifBindingKey,
  NotifPredefinedMessageNotifBindingKey,
  EquipmentTypeEquipmentProperty,
  State,
  BrandState,
  ActionType,
  BrandActionType,
  Param,
  ActionTypeParam,
  StateParam,
  Behavior,
  BehaviorProperty,
  BehaviorState,
  BehaviorBehaviorProperty,
  CurrentEquipmentState,
  Event,
  MigrationDbConfig,
  MigrationDbExploit,
  MigrationDbSystem,
  GeneralUserAction,
  SecurityUserAction,
  ApplicationParameter,
  AuthenticationParameter,
  ScheduledJob,
};
