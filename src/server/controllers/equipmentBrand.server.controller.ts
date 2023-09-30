import express from "express";
import { Server } from "http";
import { StatusCodes } from "http-status-codes";
import { logger } from "../../../logger";
import { EquipmentBrandServerService } from "../services/equipmentBrand.server.service";
import {
  permissionsConstants,
  requirePermissions,
} from "../middlewares/permissions.server.middleware";

export const equipmentBrandServerController = (server: Server) => {
  const service = new EquipmentBrandServerService(server);

  const router = express.Router();
  router.use(express.json());

  router.get(
    "/",
    requirePermissions(permissionsConstants.EQUIPMENT_BRANDS.READ),
    (req, res) => {
      // #swagger.summary = 'get all equipments brands'
      (async () => {
        try {
          const equipmentBrands = await service.getEquipmentsBrands();
          /* #swagger.responses[200] = {
                  description: 'Returned equipments brands',
                  schema: [{
                      $id: 1,
                      $name: 'string',
                      $equipmentTypeId: 1,
                  }      ]
          } */
          res.status(StatusCodes.OK).json(equipmentBrands);
        } catch (err) {
          logger.error("error while retrieving all equipments brands! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );
  return router;
};
