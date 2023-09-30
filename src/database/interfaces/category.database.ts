export interface CategoryDatabaseInterface {
  id: string;
  name: string;
  description: string;
}
export type NewCategory = Omit<CategoryDatabaseInterface, "id">;
