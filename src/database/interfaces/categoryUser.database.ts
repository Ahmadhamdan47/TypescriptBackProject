export interface CategoryUserDatabaseInterface {
  CategoryId: number;
  UserId: number;
}

export type NewCategoryUser =
  Required<CategoryUserDatabaseInterface>;
