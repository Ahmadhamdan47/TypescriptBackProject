import { Model, Sequelize, DataTypes } from "sequelize";

/**
 * Authentication parameters of the application
 */
export class AuthenticationParameter extends Model {
  declare id: number;
  // Infos of the auth server needed
  // Auth mode : OAuth2, OIDC,...
  declare mode: string;
  // Login page url
  declare authorize_url: string;
  // Url to get tokens after login
  declare token_url: string;
  // Url to check the validity of the access token
  declare authenticate_url: string;
  // Url to logout the user and/or invalidate the access token
  declare logout_url: string;
  // Url to manage users if the server allows it
  declare users_url: string;
  // Client id to allow requests to the auth server
  declare client_id: string;
  // Redirect url used after getting the tokens of the auth server
  declare redirect_uri: string;
  // Client secret to allow requests to the auth server
  declare client_secret: string;
  // Client id to allow users url requests to the auth server
  declare admin_client_id: string;
  // Client secret to allow users url requests to the auth server
  declare admin_client_secret: string;
  // Name of the attribute to get the username after token is decoded
  declare token_username_key: string;
  // Character to split (if concerned) to get the username after token is decoded
  declare token_username_split: string;
  // Infos of the active directory server
  // Active directory url (if concerned)
  declare ad_url: string;
  // Active directory base domain (if concerned)
  declare ad_base_dn: string;
  // Active directory username (if concerned)
  declare ad_username: string;
  // Active directory password (if concerned)
  declare ad_password: string;

  static initModel(sequelize: Sequelize): void {
    AuthenticationParameter.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        mode: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        authorize_url: {
          type: DataTypes.STRING,
        },
        token_url: {
          type: DataTypes.STRING,
        },
        authenticate_url: {
          type: DataTypes.STRING,
        },
        logout_url: {
          type: DataTypes.STRING,
        },
        users_url: {
          type: DataTypes.STRING,
        },
        client_id: {
          type: DataTypes.STRING,
        },
        redirect_uri: {
          type: DataTypes.STRING,
        },
        client_secret: {
          type: DataTypes.STRING,
        },
        admin_client_id: {
          type: DataTypes.STRING,
        },
        admin_client_secret: {
          type: DataTypes.STRING,
        },
        token_username_key: {
          type: DataTypes.STRING,
        },
        token_username_split: {
          type: DataTypes.STRING,
        },
        ad_url: {
          type: DataTypes.STRING,
        },
        ad_base_dn: {
          type: DataTypes.STRING,
        },
        ad_username: {
          type: DataTypes.STRING,
        },
        ad_password: {
          type: DataTypes.STRING,
        },
      },
      {
        sequelize, // pass the database instance here
        tableName: "authenticationParameters", // here names can be pass in camel case for consistency
      }
    );
  }
}
