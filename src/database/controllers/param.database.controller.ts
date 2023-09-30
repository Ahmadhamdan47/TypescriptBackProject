import express from "express";
import { Server } from "http";
import { logger } from "../../../logger";
import { StatusCodes } from "http-status-codes";
import { ParamDatabaseInterface } from "../interfaces/param.database";
import { ParamDatabaseService } from "../services/param.database.service";

export const paramDatabaseController = (server: Server) => {
  const service = new ParamDatabaseService(server);

  const router = express.Router();
  router.use(express.json());

  router.get("/", (req, res) => {
    // #swagger.summary = 'get all params '
    (async () => {
      try {
        const params = await service.retrieveAllParams();
        /* #swagger.responses[200] = {
          description: 'Returned params',
          schema: [{
            $id: '1',
            $nameId: 'string',
            $labelFr: 'string',
            $labelEn: 'string',
            $kind: 'string',
            $values: 'string',
          }      ]
        } */
        res.status(StatusCodes.OK).json(params);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.get("/:id", (req, res) => {
    // #swagger.summary = 'get one param by id '
    (async () => {
      try {
        const id = req.params.id;
        /*  #swagger.parameters['id'] = {
          in: 'path',
          type: 'integer',
          description: 'param ID.' } */
        const param = await service.retrieveOneParam(id);
        /* #swagger.responses[200] = {
            description: 'Returned param',
            schema: {
              $id: '1',
              $nameId: 'string',
              $labelFr: 'string',
              $labelEn: 'string',
              $kind: 'string',
              $values: 'string',
            }
          } */
        res.status(StatusCodes.OK).json(param);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.post("/", (req, res) => {
    // #swagger.summary = 'create one or a list of params'
    (async () => {
      try {
        // TODO : like other swagger comments
        if (req.body instanceof Array) {
          res
            .status(StatusCodes.CREATED)
            .json(
              await service.createParams(req.body as ParamDatabaseInterface[])
            );
        } else {
          res
            .status(StatusCodes.CREATED)
            .json(
              await service.createOneParam(req.body as ParamDatabaseInterface)
            );
        }
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.delete("/", (req, res) => {
    // #swagger.summary = 'delete params from ids'
    (async () => {
      try {
        const ids = req.body;
        /*  #swagger.parameters['ids'] = {
          in: 'body',
          description: 'params ids',
          schema: {
            ids:[1, 2, 3]
          }
        } */
        await service.deleteParamsFromIds(ids);
        res.sendStatus(StatusCodes.OK);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  return router;
};
