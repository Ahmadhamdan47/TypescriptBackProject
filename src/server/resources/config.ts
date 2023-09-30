import os from "os";
export const isHttpS = true; // This is a general flag to indicate if the server is running in https mode or not
export const hostname = os.hostname().toLowerCase();
export const httPrefix = isHttpS ? `https://${hostname}` : "http://localhost";

export default {
  xtvision: {
    url: `${httPrefix}:5001`,
    databaseUrl: `${httPrefix}:5001/database`,
    cors: [`${httPrefix}:3000`], // To accept Front requests
  },
  // Endpoints and attributes for OAuth2 or Open Id Connect (OAuth2 + user info in id_token) => see authenticationParameters.model.ts to understand attributes
  auth: {
    authorize: `${httPrefix}:8081/realms/xtvision/protocol/openid-connect/auth?client_id=xtvision&redirect_uri=${httPrefix}:5001/callback&response_type=code&scope=openid`,
    token: `${httPrefix}:8081/realms/xtvision/protocol/openid-connect/token`,
    authenticate: `${httPrefix}:8081/realms/xtvision/protocol/openid-connect/userinfo`,
    logout: `${httPrefix}:8081/realms/xtvision/protocol/openid-connect/logout?post_logout_redirect_uri=${httPrefix}:5001&id_token_hint=`,
    users: `${httPrefix}:8081/admin/realms/xtvision/users`,
    redirect_uri: `${httPrefix}:5001/callback`,
    client_id: "xtvision",
    client_secret: "SLQOfB01BVWskIvAKMP9CKXd4Pl8PBcJ",
    admin_client_id: "admin-cli",
    admin_client_secret: "eHY5ZO3DKNw3ZoxAisfdXzAcJ2UabD9S",
    // Username json key
    token_username_key: "preferred_username",
    // Username character to split if needed (ex: username@domain.local -> username)
    token_username_split: "",
  },
};
