export interface FeatureDatabaseInterface {
  id: number;
  name: string;
  description: string;
  roleIds?: number[];
}
export type NewFeature = Omit<FeatureDatabaseInterface, "id">;
