import { Server } from "http";
import config from "../resources/config";
import { prefs, customAxios as axios } from "../../webServer";
import {
  CategoryDatabaseInterface,
  NewCategory,
} from "../../database/interfaces/category.database";
import { CategoryFilter } from "../interfaces/categoriesFilter";
import { NewCategoryUser } from "../../database/interfaces/categoryUser.database";
import { logger } from "../../../logger";

export class CategoryServerService {
  constructor(protected server: Server) {}
  /**
   * Get all categories
   */
  async getCategories(): Promise<CategoryDatabaseInterface[]> {
    logger.info("getCategories");
    return (
      await axios.get(config.xtvision.databaseUrl + "/categories", {
        headers: {
          Authorization: prefs.databaseAuth,
        },
      })
    ).data;
  }

  /**
   * Insert a category in db XTVision
   */
  async insertCategory(
    newCategory: NewCategory
  ): Promise<CategoryDatabaseInterface> {
    logger.info("insertCategory");
    return (
      await axios.post(
        config.xtvision.databaseUrl + "/categories",
        newCategory,
        {
          headers: {
            Authorization: prefs.databaseAuth,
          },
        }
      )
    ).data;
  }

  /**
   * Update a category in db XTVision
   */
  async updateCategory(newCategory: NewCategory) {
    logger.info("updateCategory");
    return (
      await axios.put(
        config.xtvision.databaseUrl + "/categories",
        newCategory,
        {
          headers: {
            Authorization: prefs.databaseAuth,
          },
        }
      )
    ).data;
  }

  /**
   * Delete a category in db XTVision
   */
  async deleteCategory(id: string) {
    logger.info("deleteCategory");
    return await axios.delete(
      config.xtvision.databaseUrl + "/categories/" + id,
      {
        headers: {
          Authorization: prefs.databaseAuth,
        },
      }
    );
  }

  /**
   * Get categories in db XtVision by username
   */
  async getCategoriesByFilter(
    filters: CategoryFilter
  ): Promise<CategoryDatabaseInterface[]> {
    logger.info("getCategoriesByFilter");
    return [];
  }

  /**
   * Link a category to n users in db XtVision
   */
  async addUsers(ids: NewCategoryUser[]) {
    logger.info("addUsers");
    return (
      await axios.post(config.xtvision.databaseUrl + "/categoriesUsers", ids, {
        headers: {
          Authorization: prefs.databaseAuth,
        },
      })
    ).data;
  }
}
