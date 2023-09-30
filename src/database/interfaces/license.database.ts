export interface LicenseDatabaseInterface {
  id: number;
  nb_max_intercoms: number;
  mode: string;
  nb_max_users: number;
}
export type NewLicense = Omit<LicenseDatabaseInterface, "id">;
