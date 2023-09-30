import { PaginationSequelizeDatabaseInterface } from "../../database/interfaces/pagination.database";
import {
  PAGINATION_DEFAULT_SIZE,
  PAGINATION_DEFAULT_OFFSET,
} from "../resources/constants";

export interface PaginationQueryServerInterface {
  page?: number;
  size?: number;
}

export interface PaginationResultServerInterface {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  datas: any;
}

export function getPagination(
  pagination: PaginationQueryServerInterface
): string {
  // Quantity of items to fetch
  const size = pagination.size ? pagination.size : PAGINATION_DEFAULT_SIZE;
  // Quantity of items to skip
  const offset =
    pagination.page && pagination.page > 1
      ? (pagination.page - 1) * size
      : PAGINATION_DEFAULT_OFFSET;
  pagination.size = size;
  return "?size=" + size + "&offset=" + offset;
}

export function getPagingDatas(
  rowsWithCount: PaginationSequelizeDatabaseInterface,
  paginationQuery: PaginationQueryServerInterface
): PaginationResultServerInterface {
  return {
    totalItems: rowsWithCount.count,
    totalPages: Math.ceil(rowsWithCount.count / paginationQuery.size!),
    currentPage: paginationQuery.page ? Number(paginationQuery.page) : 1,
    datas: rowsWithCount.rows,
  };
}
