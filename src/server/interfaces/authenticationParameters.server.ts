export interface AuthenticationParametersServerInterface {
  mode: string;
  authorize_url: string;
  token_url: string;
  authenticate_url: string;
  logout_url: string;
  users_url: string;
  client_id: string;
  redirect_uri: string;
  client_secret: string;
  admin_client_id: string;
  admin_client_secret: string;
  token_username_key: string;
  token_username_split: string;
  ad_url: string;
  ad_base_dn: string;
  ad_username: string;
  ad_password: string;
}
