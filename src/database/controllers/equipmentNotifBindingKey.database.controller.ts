import express from "express";
import { Server } from "http";
import { logger } from "../../../logger";
import { StatusCodes } from "http-status-codes";
import { NewEquipmentNotifBindingKey } from "../interfaces/equipmentNotifBindingKey.database";
import { EquipmentNotifBindingKeyDatabaseService } from "../services/equipmentNotifBindingKey.database.service";

export const equipmentNotifBindingKeyDatabaseController = (server: Server) => {
  const service = new EquipmentNotifBindingKeyDatabaseService(server);

  const router = express.Router();
  router.use(express.json());

  router.get("/", (req, res) => {
    // #swagger.summary = 'get all equipments and notif binding keys linked'
    (async () => {
      try {
        const equipmentId = req.query.equipmentId;
        /*  #swagger.parameters['equipmentId'] = {
          in: 'query',
          type: 'integer',
          description: 'equipment ID.' } */
        const notifBindingKeyId = req.query.notifBindingKeyId;
        /*  #swagger.parameters['notifBindingKeyId'] = {
          in: 'query',
          type: 'integer',
          description: 'notif binding key ID.' } */
        const equipmentNotifBindingKeys =
          await service.retrieveAllEquipmentsNotifBindingKeys(
            equipmentId,
            notifBindingKeyId
          );
        /* #swagger.responses[200] = {
            description: 'Returned notif binding keys ids and equipments ids linked',
            schema: [{
              NotifBindingKeyId: 1,
              EquipmentId: 2,
            }      ]
          } */
        res.status(StatusCodes.OK).json(equipmentNotifBindingKeys);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  // req.body is equipments ids
  router.post("/notifBindingKeysIds", (req, res) => {
    // #swagger.summary = 'get all notif binding keys ids from equipments ids'
    (async () => {
      try {
        const equipmentIds = req.body;
        /*  #swagger.parameters['equipmentIds'] = {
          in: 'body',
          description: 'equipments ids',
          schema: [1, 2, 3]
        } */
        const notifBindingKeysIds =
          await service.retrieveAllNotifBindingKeysIdsFromEquipmentsIds(
            equipmentIds
          );
        /* #swagger.responses[200] = {
            description: 'Returned notif binding keys ids and equipments ids linked',
            schema: [1,2]
        } */
        res.status(StatusCodes.OK).json(notifBindingKeysIds);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  // req.body is notif binding keys ids
  router.post("/equipmentsIds", (req, res) => {
    // #swagger.summary = 'get all equipments ids from notif binding keys ids'
    (async () => {
      try {
        const notifBindingKeysIds = req.body;
        /*  #swagger.parameters['notifBindingKeysIds'] = {
          in: 'body',
          description: 'notif binding keys ids',
          schema: [1, 2, 3]
        } */
        const equipmentsIds =
          await service.retrieveAllEquipmentsIdsFromNotifBindingKeysIds(
            notifBindingKeysIds
          );
        /* #swagger.responses[200] = {
            description: 'Returned notif binding keys ids and equipments ids linked',
            schema: [1,2]
        } */
        res.status(StatusCodes.OK).json(equipmentsIds);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.post("/", (req, res) => {
    // #swagger.summary = 'create a list of notif binding keys ids and equipments ids linked'
    (async () => {
      try {
        const newEquipmentsNotifBindingKeys: NewEquipmentNotifBindingKey[] =
          req.body;
        /*  #swagger.parameters['equipmentsNotifBindingKeys'] = {
          in: 'body',
          description: 'notif binding keys ids and equipments ids linked',
          schema: [{
            $NotifBindingKeyId: 1,
            $EquipmentId: 2,
          }       ]
        } */
        const equipmentsNotifBindingKeys =
          await service.createEquipmentsNotifBindingKeys(
            newEquipmentsNotifBindingKeys
          );
        /* #swagger.responses[200] = {
            description: 'Returned notif binding keys ids and equipments ids linked',
            schema: [{
              $NotifBindingKeyId: 1,
              $EquipmentId: 2,
            }      ]
          } */
        res.status(StatusCodes.CREATED).json(equipmentsNotifBindingKeys);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  return router;
};
