import express from "express";
import { Server } from "http";
import { logger } from "../../../logger";
import { StatusCodes } from "http-status-codes";
import { CurrentEquipmentStateDatabaseInterface } from "../interfaces/currentEquipmentState.database";
import { CurrentEquipmentStateDatabaseService } from "../services/currentEquipmentState.database.service";

export const currentEquipmentStateDatabaseController = (server: Server) => {
  const service = new CurrentEquipmentStateDatabaseService(server);

  const router = express.Router();
  router.use(express.json());

  router.get("/", (req, res) => {
    // #swagger.summary = 'get all currents equipment states '
    (async () => {
      try {
        const equipmentId = req.query.equipmentId;
        /*  #swagger.parameters['equipmentId'] = {
          in: 'query',
          type: 'integer',
          description: 'equipment ID.' } */
        const equipmentStates = await service.retrieveAllCurrentEquipmentStates(
          equipmentId
        );
        /* #swagger.responses[200] = {
          description: 'Returned currents equipments states',
          schema: [{
            id: 1,
            equipmentPropertyId: 5,
            currentStateId : 22
          }      ]
        } */
        res.status(StatusCodes.OK).json(equipmentStates);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.get("/:id", (req, res) => {
    // #swagger.summary = 'get one current equipment state by id '
    (async () => {
      try {
        const id = req.params.id;
        /*  #swagger.parameters['id'] = {
          in: 'path',
          type: 'integer',
          description: 'EquipmentState ID.' } */
        const currentEquipmentState =
          await service.retrieveOneCurrentEquipmentState(id);
        /* #swagger.responses[200] = {
          description: 'Returned current equipment state',
          schema: {
            $id: 1,
            $equipmentPropertyId: 5,
            $currentStateId : 22
          }
        } */
        res.status(StatusCodes.OK).json(currentEquipmentState);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.post("/", (req, res) => {
    // #swagger.summary = 'create one or a list of currents equipments states'
    (async () => {
      try {
        // TODO : like other swagger comments
        if (req.body instanceof Array) {
          res
            .status(StatusCodes.CREATED)
            .json(
              await service.createCurrentEquipmentStates(
                req.body as CurrentEquipmentStateDatabaseInterface[]
              )
            );
        } else {
          res
            .status(StatusCodes.CREATED)
            .json(
              await service.createOneCurrentEquipmentState(
                req.body as CurrentEquipmentStateDatabaseInterface
              )
            );
        }
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.put("/:id", (req, res) => {
    // #swagger.summary = 'update current equipment state'
    (async () => {
      try {
        const id = req.params.id;
        /*  #swagger.parameters['id'] = {
          in: 'path',
          type: 'integer',
          description: 'EquipmentState ID.' } */
        const parameters = req.body;
        /*  #swagger.parameters['parameters'] = {
          in: 'body',
          description: 'equipment state parameters to update',
          schema: {
            equipmentPropertyId: 5,
            currentStateId : 22
          }
        } */
        await service.updateCurrentEquipmentState(id, parameters);
        res.sendStatus(StatusCodes.OK);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.put("/", (req, res) => {
    // #swagger.summary = 'update current equipments states'
    (async () => {
      try {
        const parameters = req.body;
        /*  #swagger.parameters['parameters'] = {
          in: 'body',
          description: 'currents equipments states parameters to update',
          schema: [{
            id: 1,
            equipmentPropertyId: 5,
            currentStateId : 22
          }      ]
        } */
        await service.updateCurrentsEquipmentsStates(parameters);
        res.sendStatus(StatusCodes.OK);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.delete("/", (req, res) => {
    // #swagger.summary = 'delete all currents equipment states'
    (async () => {
      try {
        await service.deleteAllCurrentEquipmentStates();
        res.sendStatus(StatusCodes.OK);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.delete("/:id", (req, res) => {
    // #swagger.summary = 'delete one current equipment state by id '
    (async () => {
      try {
        const id = req.params.id;
        /*  #swagger.parameters['id'] = {
          in: 'path',
          type: 'integer',
          description: 'EquipmentState ID.' } */
        await service.deleteOneCurrentEquipmentState(id);
        res.sendStatus(StatusCodes.OK);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });
  return router;
};
