const options = {
  autoHeaders: true, // Enable/Disable automatic headers capture. By default is true
  autoQuery: true, // Enable/Disable automatic query capture. By default is true
  autoBody: true, // Enable/Disable automatic body capture. By default is true
};

const docDatabase = {
  info: {
    title: "XTVision database",
    description: "All XTVsion database apis",
  },
  host: "localhost:5001",
  basePath: "/",
  schemes: ["http"],
  consumes: [], // by default: ['application/json']
  produces: [], // by default: ['application/json']
  securityDefinitions: {}, // by default: empty object
  definitions: {}, // by default: empty object (Swagger 2.0)
  components: {}, // by default: empty object (OpenAPI 3.x)
};

const docServer = {
  info: {
    title: "XTVision server",
    description: "All XTVsion server apis",
  },
  host: "localhost:5001",
  basePath: "/",
  schemes: ["http"],
  consumes: [], // by default: ['application/json']
  produces: [], // by default: ['application/json']
  securityDefinitions: {}, // by default: empty object
  definitions: {}, // by default: empty object (Swagger 2.0)
  components: {}, // by default: empty object (OpenAPI 3.x)
};

const swaggerAutogen = require("swagger-autogen")(options);

const outputFileServer = "./xtvision_server_openApi_autogenerated.json";
const outputFileDatabase = "./xtvision_database_openApi_autogenerated.json";

const endpointsFilesForServer = ["./src/server/server.router.ts"];
const endpointsFilesForDatabase = ["./src/database/database.router.ts"];

swaggerAutogen(outputFileServer, endpointsFilesForServer, docServer);
swaggerAutogen(outputFileDatabase, endpointsFilesForDatabase, docDatabase);
