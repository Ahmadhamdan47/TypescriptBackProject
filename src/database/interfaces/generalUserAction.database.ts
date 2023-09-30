export interface GeneralUserActionDatabaseInterface {
  actionType?: string;
  actionObject?: string;
  username?: string;
  isSuccessful?: boolean;
  description?: string;
  param1?: string | null;
  param2?: string | null;
}

export type NewGeneralUserAction = Required<GeneralUserActionDatabaseInterface>;
