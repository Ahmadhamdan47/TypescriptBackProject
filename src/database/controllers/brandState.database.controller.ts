import express from "express";
import { Server } from "http";
import { logger } from "../../../logger";
import { StatusCodes } from "http-status-codes";
import { BrandStateDatabaseService } from "../services/brandState.database.service";
import { BrandStateDatabaseInterface } from "../interfaces/brandState.database";

export const brandStateDatabaseController = (server: Server) => {
  const service = new BrandStateDatabaseService(server);

  const router = express.Router();
  router.use(express.json());

  router.get("/", (req, res) => {
    // #swagger.summary = 'get all brands ids and states ids linked'
    (async () => {
      try {
        const brandId = req.query.brandId;
        /*  #swagger.parameters['brandId'] = {
          in: 'query',
          type: 'integer',
          description: 'brand ID.' } */
        const stateId = req.query.stateId;
        /*  #swagger.parameters['stateId'] = {
          in: 'query',
          type: 'integer',
          description: 'state ID.' } */
        const brandsStates = await service.retrieveAllBrandsStates(
          brandId,
          stateId
        );
        /* #swagger.responses[200] = {
          description: 'Returned brands ids and states ids linked',
          schema: [{
            EquipmentBrandId: 1,
            StateId: 2,
          }      ]
        } */
        res.status(StatusCodes.OK).json(brandsStates);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.post("/statesIds", (req, res) => {
    // #swagger.summary = 'get all states ids from ids brands'
    (async () => {
      try {
        const ids = req.body;
        /*  #swagger.parameters['brandsIds'] = {
          in: 'body',
          description: 'brands ids',
          schema: [1, 2, 3]
        } */
        const statesIds = await service.retrieveAllStatesIdsFromBrandsIds(ids);
        /* #swagger.responses[200] = {
          description: 'Returned brands ids and states ids linked',
          schema: [{
            $EquipmentBrandId: 1,
            $StateId: 2,
          }      ]
        } */
        res.status(StatusCodes.OK).json(statesIds);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.post("/", (req, res) => {
    // #swagger.summary = 'create one or a list of brands ids and states ids linked'
    (async () => {
      try {
        const newBrandsStates: BrandStateDatabaseInterface[] = req.body;
        /*  #swagger.parameters['brandsStates'] = {
          in: 'body',
          description: 'brands ids and states ids linked',
          schema: [{
            $EquipmentBrandId: 1,
            $StateId: 2,
          }]
        } */
        const brandsStates = await service.createBrandsStates(newBrandsStates);
        /* #swagger.responses[200] = {
          description: 'Returned brands ids and states ids linked',
          schema: [{
            $EquipmentBrandId: 1,
            $StateId: 2,
          }      ]
        } */
        res.status(StatusCodes.CREATED).json(brandsStates);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  return router;
};
