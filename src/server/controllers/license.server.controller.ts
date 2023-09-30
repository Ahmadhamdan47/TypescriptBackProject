import express from "express";
import { Server } from "http";
import { LicenseDatabaseInterface } from "../../database/interfaces/license.database";
import { LicenseServerService } from "../services/license.server.service";
import {
  permissionsConstants,
  requirePermissions,
} from "../middlewares/permissions.server.middleware";

export const licenseServerController = (server: Server) => {
  const service = new LicenseServerService(server);

  const router = express.Router();
  router.use(express.json());

  // TODO SPLIT CREATE AND UPDATE
  router.put(
    "/",
    requirePermissions(permissionsConstants.LICENCES.CREATE),
    (req, res) => {
      // #swagger.summary = 'insert or update licence'
      (async () => {
        const license = req.body as LicenseDatabaseInterface;
        /*  #swagger.parameters['license'] = {
                in: 'body',
                description: 'new licence object',
                schema: {
                    $nb_max_intercoms: 'number',
                    $mode: 'string',
                    $nb_max_users: 'number'
                }
        } */
        await service.insertOrUpdateInfosLicense(license);
      })();
    }
  );

  router.get(
    "/:element",
    requirePermissions(permissionsConstants.LICENCES.READ),
    (req, res) => {
      // #swagger.summary = 'get Element From License'
      (async () => {
        await service.getElementFromLicense(req.params.element);
      })();
    }
  );

  return router;
};
