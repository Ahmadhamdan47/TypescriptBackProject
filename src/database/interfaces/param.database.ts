export interface ParamDatabaseInterface {
  id: number;
  nameId: string;
  labelFr: string;
  labelEn: string;
  kind: string;
  paramValues: any;
}

export type NewParam = Omit<ParamDatabaseInterface, "id">;
