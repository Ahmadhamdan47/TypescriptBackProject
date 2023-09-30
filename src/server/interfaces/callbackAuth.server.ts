export interface CallbackAuthUser {
  access_token: string;
  refresh_token: string;
  id_token: string;
  username: string;
  language: string;
  time_zone: string;
  features: string[];
}
