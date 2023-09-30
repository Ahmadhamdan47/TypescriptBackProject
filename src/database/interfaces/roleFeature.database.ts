export interface RoleFeatureDatabaseInterface {
  RoleId: number;
  FeatureId: number;
}

export type NewRoleFeature = Required<RoleFeatureDatabaseInterface>;
