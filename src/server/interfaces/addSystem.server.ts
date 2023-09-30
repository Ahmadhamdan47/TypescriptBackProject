export interface AddSystemServerInterface {
  address: string;
  kind: string;
  name: string;
  port?: string;
  managementArea: string;
  category: string;
  brand: string;
  createdBy: string;
  authMode: AuthMode;
  user: string;
  password: string;
}

export enum AuthMode {
  Basic = "Basic",
  //Oauth2 = "OAuth2", // TODO V2 ?
}
