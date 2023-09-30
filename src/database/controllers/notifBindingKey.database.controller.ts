import express from "express";
import { Server } from "http";
import { logger } from "../../../logger";
import { StatusCodes } from "http-status-codes";
import { NewNotifBindingKey } from "../interfaces/notifBindingKey.database";
import { NotifBindingKeyDatabaseService } from "../services/notifBindingKey.database.service";

export const notifBindingKeyDatabaseController = (notifBindingKey: Server) => {
  const service = new NotifBindingKeyDatabaseService(notifBindingKey);

  const router = express.Router();
  router.use(express.json());

  router.get("/", (req, res) => {
    // #swagger.summary = 'get all notif binding keys '
    (async () => {
      try {
        const notifBindingKeys = await service.retrieveAllNotifBindingKeys();
        /* #swagger.responses[200] = {
          description: 'Returned notif binding keys',
          schema: [{
            $id: 1,
            $name: 'string',
          }      ]
        } */
        res.status(StatusCodes.OK).json(notifBindingKeys);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.get("/:id", (req, res) => {
    // #swagger.summary = 'get one notif binding key by id '
    (async () => {
      try {
        const id = req.params.id;
        /*  #swagger.parameters['id'] = {
          in: 'path',
          type: 'integer',
          description: 'notif binding key ID.' } */
        const notifBindingKey = await service.retrieveOneNotifBindingKey(id);
        /* #swagger.responses[200] = {
            description: 'Returned notif binding key',
            schema: {
              $id: 1,
              $name: 'string',
            }
          } */
        res.status(StatusCodes.OK).json(notifBindingKey);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.post("/", (req, res) => {
    // #swagger.summary = 'create a notif binding key'
    (async () => {
      try {
        const newNotifBindingKey: NewNotifBindingKey = req.body;
        /*  #swagger.parameters['notifBindingKey'] = {
            in: 'body',
            description: 'new notif binding key object ',
            schema: {
                    id: 1,
                    name: 'notifBindingKey',
                    systemId: 1
            }
    } */
        const notifBindingKey = await service.createOneNotifBindingKey(
          newNotifBindingKey
        );
        /* #swagger.responses[200] = {
            description: 'Returned notif binding key',
            schema: {
              $id: 1,
              $name: 'string',
            }
          } */
        res.status(StatusCodes.CREATED).json(notifBindingKey);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.put("/:id", (req, res) => {
    // #swagger.summary = 'update the name of a notif binding key'
    (async () => {
      try {
        const id = req.params.id;
        /*  #swagger.parameters['id'] = {
          in: 'path',
          type: 'integer',
          description: 'notif binding key ID.' } */
        const name = req.body.name;
        /*  #swagger.parameters['name'] = {
          in: 'body',
          description: 'notif binding key name',
          schema: 'notifBindingKey'
        } */
        await service.updateNotifBindingKeyNameFromId(id, name);
        res.sendStatus(StatusCodes.OK);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.delete("/", (req, res) => {
    // #swagger.summary = 'delete all notif binding keys '
    (async () => {
      try {
        const ids = req.body;
        /*  #swagger.parameters['ids'] = {
          in: 'body',
          description: 'notif binding keys ids',
          schema: {
            ids:[1, 2, 3]
          }
        } */
        await service.deleteNotifBindingKeysFromIds(ids);
        res.sendStatus(StatusCodes.OK);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.delete("/:id", (req, res) => {
    // #swagger.summary = 'delete one notif binding key by id '
    (async () => {
      try {
        const id = req.params.id;
        /*  #swagger.parameters['id'] = {
          in: 'path',
          type: 'integer',
          description: 'notif binding key ID.' } */
        await service.deleteOneNotifBindingKey(id);
        res.sendStatus(StatusCodes.OK);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });
  return router;
};
