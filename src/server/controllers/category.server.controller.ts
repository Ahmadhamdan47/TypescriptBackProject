import express from "express";
import { Server } from "http";
import { logger } from "../../../logger";
import { StatusCodes } from "http-status-codes";
import { NewCategory } from "../../database/interfaces/category.database";
import { CategoryServerService } from "../services/category.server.service";
import {
  permissionsConstants,
  requirePermissions,
} from "../middlewares/permissions.server.middleware";
import { CategoryFilter } from "../interfaces/categoriesFilter";
import { NewCategoryUser } from "../../database/interfaces/categoryUser.database";

export const categoryServerController = (server: Server) => {
  const service = new CategoryServerService(server);

  const router = express.Router();
  router.use(express.json());

  router.get(
    "/",
    requirePermissions(permissionsConstants.CATEGORIES.READ),
    (req, res) => {
      // #swagger.summary = 'get all categories'
      (async () => {
        try {
          const categories = await service.getCategories();
          /* #swagger.responses[200] = {
            description: 'Returned categories',
            schema: [{
              $id: 1,
              $name: 'xtvision',
              description: 'Default user'
            }      ]
          } */
          res.status(StatusCodes.OK).json(categories);
        } catch (err) {
          logger.error("error while retrieving all categories! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.post(
    "/filter",
    requirePermissions(permissionsConstants.CATEGORIES.READ),
    (req, res) => {
      // #swagger.summary = 'get categories by filter'
      (async () => {
        try {
          const filter: CategoryFilter = req.body;
          /*  #swagger.parameters['filters'] = {
                in: 'body',
                description: 'filter categories by username',
                schema: {
                      $username: 'string'
                }
        } */
          const categories = await service.getCategoriesByFilter(filter);
          /* #swagger.responses[200] = {
          description: 'Returned categories',
          schema: [{
            $id: 1,
            $name: 'xtvision',
            description: 'Default user'
          }      ]
        } */
          res.status(StatusCodes.OK).json(categories);
        } catch (err) {
          logger.error("error while retrieving categories with filters! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.delete(
    "/:id",
    requirePermissions(permissionsConstants.CATEGORIES.DELETE),
    (req, res) => {
      // #swagger.summary = 'delete a category'
      (async () => {
        try {
          const id = req.params.id;
          /*  #swagger.parameters['id'] = {
                in: 'path',
                type: 'integer',
                description: 'category ID.' } */
          await service.deleteCategory(id);
          res.sendStatus(StatusCodes.OK);
        } catch (err) {
          logger.error("error while deleting category! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.post(
    "/",
    requirePermissions(permissionsConstants.CATEGORIES.CREATE),
    (req, res) => {
      // #swagger.summary = 'add a new category'
      (async () => {
        try {
          const newCategory: NewCategory = req.body;
          /*  #swagger.parameters['category'] = {
                in: 'body',
                description: 'new category object',
                schema: {
                      $name: 'string',
                      description: 'string',
                }
        } */
          const category = await service.insertCategory(newCategory);
          /* #swagger.responses[200] = {
            description: 'the id of the created category',
            schema: {
              $id: 1,
              $name: 'string',
              description: 'string',
            }      
          } */
          res.status(StatusCodes.CREATED).json(category);
        } catch (err) {
          logger.error("error while creating category! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  router.put(
    "/",
    requirePermissions(permissionsConstants.CATEGORIES.UPDATE),
    (req, res) => {
      // #swagger.summary = 'update a Category'
      (async () => {
        try {
          const category = req.body as NewCategory;
          /*  #swagger.parameters['category'] = {
                in: 'body',
                description: 'update category object',
                schema: {
                      name: 'string',
                      description: 'string',
                }
        } */
          await service.updateCategory(category);
          res.sendStatus(StatusCodes.OK);
        } catch (err) {
          logger.error("error while updating category! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  /*----------------------------------------------
  |  LINKS
  ------------------------------------------------*/

  router.post(
    "/linkUsers",
    requirePermissions(permissionsConstants.CATEGORIES.UPDATE),
    (req, res) => {
      // #swagger.summary = 'link a category with n users'
      (async () => {
        try {
          const categoryUsers: NewCategoryUser[] = req.body;
          /*  #swagger.parameters['linkCategoryUsers'] = {
            in: 'body',
            description: 'category id and user id',
            schema: [{
              $CategoryId: 1,
              $UsersId: 1,
            }]
          } */
          await service.addUsers(categoryUsers);
          res.sendStatus(StatusCodes.CREATED);
        } catch (err) {
          logger.error("error while linking category with users! ", err);
          res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      })();
    }
  );

  return router;
};
