import { Server } from "http";
import { Op } from "sequelize";
import { logger } from "../../../logger";
import { NewSystem } from "../interfaces/system.database";
import { System } from "../models/system.model";
import { BehaviorStateDatabaseService } from "./behaviorState.database.service";
import { BehaviorPropertyDatabaseService } from "./behaviorProperty.database.service";
import { ParamDatabaseService } from "./param.database.service";
import { ActionTypeDatabaseService } from "./actionType.database.service";
import { ActionTypeParamDatabaseService } from "./actionTypeParam.database.service";
import { EquipmentTypeDatabaseService } from "./equipmentType.database.service";
import { EquipmentTypeEquipmentPropertyDatabaseService } from "./equipmentTypeEquipmentProperty.database.service";
import { StateDatabaseService } from "./state.database.service";
import { StateParamDatabaseService } from "./stateParam.database.service";
import { EquipmentPropertyDatabaseService } from "./equipmentProperty.database.service";
import { NotifBindingKeyDatabaseService } from "./notifBindingKey.database.service";
import { SystemFilter } from "../../server/interfaces/systemsFilter";

export class SystemDatabaseService {
  constructor(protected server: Server) {}
  serviceEquipmentType = new EquipmentTypeDatabaseService(this.server);
  serviceNotifBindingKey = new NotifBindingKeyDatabaseService(this.server);
  serviceEquipmentProperty = new EquipmentPropertyDatabaseService(this.server);
  serviceEquipmentTypeEquipmentProperty =
    new EquipmentTypeEquipmentPropertyDatabaseService(this.server);
  serviceStateParam = new StateParamDatabaseService(this.server);
  serviceActionTypeParam = new ActionTypeParamDatabaseService(this.server);
  serviceParam = new ParamDatabaseService(this.server);
  serviceState = new StateDatabaseService(this.server);
  serviceActionType = new ActionTypeDatabaseService(this.server);
  serviceBehaviorState = new BehaviorStateDatabaseService(this.server);
  serviceBehaviorProperty = new BehaviorPropertyDatabaseService(this.server);

  async createOneSystem(newSystem: NewSystem): Promise<System> {
    logger.info("createOneSystem");
    try {
      const result = await System.create(newSystem);
      return result;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async updateSystem(id: string, attributesToUpdate: any): Promise<void> {
    logger.info("updateSystem");
    try {
      await System.update(attributesToUpdate, {
        where: {
          id,
        },
      });
      return;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveAllSystems(name: any): Promise<System[]> {
    logger.info("retrieveAllSystems");
    let condition: any;
    try {
      condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
      const result = await System.findAll({ where: condition });
      return result;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveOneSystem(id: string): Promise<System | null> {
    logger.info("retrieveOneSystem");
    try {
      const result = await System.findByPk(id);
      return result;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async retrieveSystemsByFilters(filters: SystemFilter): Promise<System[]> {
    logger.info("retrieveSystemsByFilters");
    const conditions = [];
    try {
      if (filters.brand) {
        conditions.push({ brand: { [Op.like]: `%${filters.brand}%` } });
      }
      if (filters.kind) {
        conditions.push({ kind: { [Op.like]: `%${filters.kind}%` } });
      }
      const conditionWhere: any = {
        where: conditions,
      };
      return await System.findAll(conditionWhere);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async deleteAllSystems(): Promise<void> {
    logger.info("deleteAllSystems");
    try {
      await this.deleteDatasLinkedToAllSystems();
      await System.destroy({
        where: {},
        truncate: false,
      });
      return;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async deleteOneSystem(id: string): Promise<void> {
    logger.info("deleteOneSystem");
    try {
      await this.deleteDatasLinkedToSystem(id);
      await System.destroy({
        where: {
          id,
        },
      });
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async deleteDatasLinkedToAllSystems() {
    logger.info("deleteDatasLinkedToAllSystems");
    await this.serviceParam.deleteParamsFromIds();
    await this.serviceState.deleteStatesFromIds();
    await this.serviceActionType.deleteActionsTypesFromIds();
    await this.serviceEquipmentProperty.deleteEquipmentPropertiesFromIds();
    await this.serviceNotifBindingKey.deleteNotifBindingKeysFromIds();
  }

  async deleteDatasLinkedToSystem(systemId: string) {
    logger.info("deleteDatasLinkedToSystem");
    // get all equipment types ids from system id
    const equipmentsTypesIds =
      await this.serviceEquipmentType.retrieveAllEquipmentsTypesIdsFromSystemId(
        systemId
      );
    if (equipmentsTypesIds) {
      const equipmentsPropertiesIds =
        await this.serviceEquipmentTypeEquipmentProperty.retrieveAllEquipmentPropertiesIdsFromEquipmentsTypesIds(
          equipmentsTypesIds
        );
      const actionsTypesIds =
        await this.serviceActionType.retrieveAllActionsTypesIdsFromEquipmentsPropertiesIds(
          equipmentsPropertiesIds
        );
      const statesIds =
        await this.serviceState.retrieveAllStatesIdsFromEquipmentsPropertiesIds(
          equipmentsPropertiesIds
        );
      const paramsIds = (
        await this.serviceActionTypeParam.retrieveAllParamsIdsFromActionsTypesIds(
          actionsTypesIds
        )
      ).concat(
        await this.serviceStateParam.retrieveAllParamsIdsFromStatesIds(
          statesIds
        )
      );
      // Delete all datas with ids in ...
      await this.serviceParam.deleteParamsFromIds({ ids: paramsIds });
      await this.serviceState.deleteStatesFromIds({ ids: statesIds });
      await this.serviceActionType.deleteActionsTypesFromIds({
        ids: actionsTypesIds,
      });
      await this.serviceEquipmentProperty.deleteEquipmentPropertiesFromIds({
        ids: equipmentsPropertiesIds,
      });
    }
    // get all notif Binding Keys ids from system id
    const notifBindingKeysIds =
      await this.serviceNotifBindingKey.retrieveAllNotifBindingKeysIdsFromSystemId(
        systemId
      );
    if (notifBindingKeysIds) {
      await this.serviceNotifBindingKey.deleteNotifBindingKeysFromIds({
        ids: notifBindingKeysIds,
      });
    }
  }
}
