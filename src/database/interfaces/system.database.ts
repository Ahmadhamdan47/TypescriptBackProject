import { AuthMode } from "../../server/interfaces/addSystem.server";

export interface SystemDatabaseInterface {
  id: number;
  name: string;
  kind: string;
  brand: string;
  port?: string;
  address: string;
  url_connexion_api: string;
  url_connexion_ws: string;
  release: string;
  state: string;
  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;
  authMode: AuthMode;
  user: string;
  password: string;
}

export type NewSystem = Omit<
  SystemDatabaseInterface,
  "id" | "createdAt" | "updatedAt"
>;
