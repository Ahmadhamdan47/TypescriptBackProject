import { Model } from "sequelize";

export interface PaginationQueryDatabaseInterface {
  size: any;
  offset: any;
}

export interface PaginationSequelizeDatabaseInterface {
  rows: Model[];
  count: number;
}
