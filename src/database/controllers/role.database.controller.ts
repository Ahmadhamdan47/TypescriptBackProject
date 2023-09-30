import express from "express";
import { Server } from "http";
import { logger } from "../../../logger";
import { StatusCodes } from "http-status-codes";
import { Role } from "../models/role.model";
import { RoleDatabaseService } from "../services/role.database.service";

export const roleDatabaseController = (server: Server) => {
  const service = new RoleDatabaseService(server);

  const router = express.Router();
  router.use(express.json());

  router.get("/", (req, res) => {
    // #swagger.summary = 'get all roles'
    (async () => {
      try {
        const name = req.query.name;
        /*  #swagger.parameters['name'] = {
          in: 'query',
          type: 'string',
          description: 'role name.' } */
        const roles: Role[] = await service.retrieveAllRoles(name);
        /* #swagger.responses[200] = {
            description: 'Returned roles',
            schema: [{
              $id: 1,
              $name: 'string',
              description: 'string',
              $Features: [{
                $name: 'string',
              }],
            }]
          } */
        res.status(StatusCodes.OK).json(roles);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  //get roles with users
  router.get("/withUsers", (req, res) => {
    // #swagger.summary = 'get roles with related users'
    (async () => {
      try {
        const name = req.query.name;
        /*  #swagger.parameters['name'] = {
          in: 'query',
          type: 'string',
          description: 'role name.' } */
        const roles: Role[] = await service.retrieveRolesWithUsers(name);
        /* #swagger.responses[200] = {
            description: 'Returned roles',
            schema: [{
              $id: 1,
              $name: 'string',
              description: 'string',
              $Users: [{
                $id: 1,
                $name: 'string',
              }],
            }]
          } */
        res.status(StatusCodes.OK).json(roles);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.get("/:id", (req, res) => {
    // #swagger.summary = 'get one role by id'
    (async () => {
      try {
        const id = req.params.id;
        /*  #swagger.parameters['id'] = {
          in: 'path',
          type: 'integer',
          description: 'role ID.' } */
        const roles = await service.retrieveOneRole(id);
        /* #swagger.responses[200] = {
            description: 'Returned role',
            schema: {
              $id: 1,
              $name: 'string',
              description: 'string',
            }
          } */
        res.status(StatusCodes.OK).json(roles);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.post("/", (req, res) => {
    // #swagger.summary = 'add a role'
    (async () => {
      try {
        const newRole = req.body;
        /*  #swagger.parameters['role'] = {
                in: 'body',
                description: 'role to add',
                schema: {
                      $name: 'string',
                      $description: 'string',
                      userIds: [1],
                      featureIds: [1],
                }
        } */
        const role = await service.createOneRole(newRole);
        /* #swagger.responses[201] = {
            description: 'Returned role',
            schema: {
              $id: 1,
              $name: 'string',
              description: 'string',
            }
          } */
        res.status(StatusCodes.CREATED).json(role);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.delete("/", (req, res) => {
    // #swagger.summary = 'delete all roles'
    (async () => {
      try {
        await service.deleteAllRoles();
        res.sendStatus(StatusCodes.OK);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.delete("/:id", (req, res) => {
    // #swagger.summary = 'delete one role by id'
    (async () => {
      try {
        const id = req.params.id;
        /*  #swagger.parameters['id'] = {
          in: 'path',
          type: 'integer',
          description: 'role ID.' } */
        await service.deleteRoleById(id);
        res.sendStatus(StatusCodes.OK);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.put("/:id", (req, res) => {
    // #swagger.summary = 'update one role by id'
    (async () => {
      try {
        const id = req.params.id;
        /*  #swagger.parameters['id'] = {
          in: 'path',
          type: 'integer',
          description: 'role ID.' } */
        const parameters = req.body;
        /*  #swagger.parameters['role'] = {
            in: 'body',
            description: 'role to update',
            schema: {
              name: 'string',
              description: 'string'
            }
          } */
        await service.updateRoleById(id, parameters);
        res.sendStatus(StatusCodes.OK);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  /*----------------------------------------------
  |  LINKS
  ------------------------------------------------*/

  router.post("/linkUsers", (req, res) => {
    // #swagger.summary = 'link a role with n users'
    (async () => {
      try {
        const roleUsers = req.body;
        /*  #swagger.parameters['NewRoleUser'] = {
          in: 'body',
          description: 'role id and user id',
          schema: [{
            $RoleId: 1,
            $UserId: 1
          }]
        } */
        await service.addUsers(roleUsers);
        res.sendStatus(StatusCodes.CREATED);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  router.post("/linkFeatures", (req, res) => {
    // #swagger.summary = 'link a role with n features'
    (async () => {
      try {
        const roleFeatures = req.body;
        /*  #swagger.parameters['NewRoleFeature'] = {
          in: 'body',
          description: 'role id and feature id',
          schema: [{
            $RoleId: 1,
            $FeatureId: 1
          }]
        } */
        await service.addFeatures(roleFeatures);
        res.sendStatus(StatusCodes.CREATED);
      } catch (err) {
        logger.error(err);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      }
    })();
  });

  return router;
};
