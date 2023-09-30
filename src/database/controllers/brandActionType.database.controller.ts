import express from "express";
import { Server } from "http";
import { logger } from "../../../logger";
import { StatusCodes } from "http-status-codes";
import { BrandActionTypeDatabaseService } from "../services/brandActionType.database.service";
import { BrandActionTypeDatabaseInterface } from "../interfaces/brandActionType.database";

export const brandActionTypeDatabaseController = (server: Server) => {
  const service = new BrandActionTypeDatabaseService(server);

  const router = express.Router();
  router.use(express.json());

  router.get("/", (req, res) => {
    // #swagger.summary = 'get all brands ids and action types ids linked'
    (async () => {
      try {
        const brandId = req.query.brandId;
        /*  #swagger.parameters['brandId'] = {
          in: 'query',
          type: 'integer',
          description: 'brand ID.' } */
        const actionTypeId = req.query.actionTypeId;
        /*  #swagger.parameters['actionTypeId'] = {
          in: 'query',
          type: 'integer',
          description: 'action type ID.' } */
        const brandsActionTypes = await service.retrieveAllBrandsActionsTypes(
          brandId,
          actionTypeId
        );
        /* #swagger.responses[200] = {
          description: 'Returned brands ids and action types ids linked',
          schema: [{
            $EquipmentBrandId: 1,
            $ActionTypeId: 2,
          }      ]
        } */
        res.status(StatusCodes.OK).json(brandsActionTypes);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.post("/actionsTypesIds", (req, res) => {
    // #swagger.summary = 'get all action types ids from brands ids'
    (async () => {
      try {
        const ids = req.body;
        /*  #swagger.parameters['ids'] = {
          in: 'body',
          description: 'brands ids',
          schema: {
            $EquipmentBrandIds: [1, 2, 3]
          }
        } */
        const actionTypesIds =
          await service.retrieveAllActionsTypesIdsFromBrandsIds(ids);
        /* #swagger.responses[200] = {
          description: 'Returned brands ids and action types ids linked',
          schema: [{
            $EquipmentBrandId: 1,
            $ActionTypeId: 2,
          }      ] 
        } */
        res.status(StatusCodes.OK).json(actionTypesIds);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.post("/", (req, res) => {
    // #swagger.summary = 'create one or a list of brands ids and action types ids linked'
    (async () => {
      try {
        const newBrandsActionTypes: BrandActionTypeDatabaseInterface[] =
          req.body;
        /*  #swagger.parameters['brandsActionTypes'] = {
          in: 'body',
          description: 'brands ids and action types ids linked',
          schema: [{
            $EquipmentBrandId: 1,
            $ActionTypeId: 2,
          }]
        } */
        const brandsActionTypes = await service.createBrandsActionsTypes(
          newBrandsActionTypes
        );
        /* #swagger.responses[200] = {
          description: 'Returned brands ids and action types ids linked',
          schema: [{
            $EquipmentBrandId: 1,
            $ActionTypeId: 2,
          }      ]
        } */
        res.status(StatusCodes.CREATED).json(brandsActionTypes);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  return router;
};
