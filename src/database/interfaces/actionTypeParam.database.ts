export interface ActionTypeParamDatabaseInterface {
  ActionTypeId: number;
  ParamId: number;
}

export type NewActionTypeParam = Required<ActionTypeParamDatabaseInterface>;
