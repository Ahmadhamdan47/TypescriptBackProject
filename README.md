## **Setting up the Working Environment:**

- Install **[Node.js](https://nodejs.org/)** version 16 LTS Gallium.
- Install **[SQL Server Management Studio (SSMS)](https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms?view=sql-server-ver15)**.
- Create the MSSQL instance xt using the SQL Server Installation Center with the corresponding password (DO NOT COMMIT this password), and update it in the following file (refer to **[setup instructions](https://manuals.gfi.com/en/SetupSQLInstanceGuide/content/administrator/topics/sql/createsqlserverinstance.htm)** and src/database/config/config.json).
- Enable TCP/IP connections for MSSQL, as described **[here](https://github.com/tediousjs/node-mssql/issues/794)**.
- Verify in SQL Server Configuration Manager that the SQL Server Browser is activated.
- Install **[Visual Studio Code](https://code.visualstudio.com/)** and the SonarLint extension for code quality (code formatting is already included in VSCode), along with other required extensions mentioned in the Wiki.
- It is possible to run xt-vision-server-ts without the OAuth2 authentication server. Optional instructions for this scenario will be provided [...]



## **OpenAPI API Specifications:**

- Refer to the Wiki at 

## **Instructions for Running the Project:**

- Ensure you have JAVA_HOME >= 11 (required for the OAuth2 server).
- Launch VSCode, open the VSCode terminal, and execute the following commands: "npm install," "cd .\src\client," "npm install," and "cd ...."
- Modify the "development," "test," and "production" sections of the "src/database/config/config.json" file with your machine's information.
- Run the script for generating/installing SSL certificates: "xt-vision-server-ts\openssl\server\ssl.sh linux" or "ssl.bat" for Windows (do this once, ensure you have admin rights).
- [Switch back to HTTP mode to make the development mode work with the dev OAuth2 server ("src/server/interfaces/config.ts," "vite.config.ts," and "client.config.ts" -> isHttpS = false, and comment out defineConfig https)]
- [Start the Keycloak OAuth2 server using the command "keycloak-xt\bin\kc.bat start-dev --http-port=8081" for Windows or "keycloak-xt\bin\kc.sh start-dev --http-port=8081" for Linux]
OR
- [Comment out the line "app.use(checkAuthentication);" in "src/webServer.ts" AND force a token (retrieve the token from unit tests in any file in the "test/server" folder) in globalApi.ts or Postman]

### **OPTIONAL (developer assistance): Add a fictitious system before starting:**

- In "src/webServer.ts," under the "start()" method below "this.server.listen...," add and adapt the following line: "new WebServerTestXXXXX().start();" (refer to the test servers in "test/server/webServerTestXXX.ts").
- Comment out the lines "await subscribeToWsSystem(...)" in "system.server.service.ts" if the fictitious system typically uses WebSocket.

### **Start the Backend and Frontend together "as in production":**

- [Modify Keycloak: localhost:8081 in a web browser => admin console => admin/admin => click on "master" in the top left corner to switch to "xt" => "Clients" menu => Clients list "xt" => set all URL ports to 5001]
- [In the "auth" attribute of the config.ts file, change the ports from 3000 to 5001]
- Run "npm start" (the database and SQL tables will initialize when the server starts).
- Home page: http(s)://localhost:5001 (xt/xt on the login page)

### **Start the Backend and Frontend separately "in development mode":**

- [Modify Keycloak: localhost:8081 in a web browser => admin console => admin/admin => click on "master" in the top left corner to switch to "xt" => "Clients" menu => Clients list "xt" => set all URL ports to 3000]
- [In the "auth" attribute of the config.ts file, change the ports from 5001 to 3000]
- Launch the Backend: "npm run server" AND/OR launch the Frontend: "npm run client"
- Home page: http(s)://localhost:3000 (xt/xt on the login page)

## **Solutions for Common Errors:**

- If the Backend crashes at startup, delete the databases and restart it before attempting to debug the issue.
- If you encounter inexplicable errors, run "npm install" again for both the Frontend and Backend (delete the package-lock.json and node-modules if necessary), then restart everything.
- If you encounter "ECONNREFUSED" errors, check the URLs and replace "localhost" with "127.0.0.1" if needed (in Keycloak and in files containing "isHttps").
- Ensure NODE_ENV is correctly configured; there may be differences between Windows (use "set" to modify the value) and Linux (use "export").

## **Project Architecture:**

- "src/database": Contains the database connection via Sequelize, as well as queries and exposed APIs for managing tables.
    - "database/config": Contains the JSON configuration file and the database connection/initialization/migration file.
    - "database/interfaces": Contains database object interfaces.
    - "database/models": Contains database table models.
    - "database/controllers": Contains queries and exposed APIs for table management.
    - "database/services": Contains query implementations for table management.
    - "database.router.ts": Contains the file that groups routes to the database's base APIs.
- "src/server": Contains the "Backend" (intelligence, business logic, and mechanisms), as well as queries and exposed APIs called from the Frontend.
    - "server/middlewares": Manages middlewares (methods executed when the server is called).
    - "server/jobs": Contains jobs executed at server startup.
    - "server/classes": Contains custom classes.
    - "server/controllers": Contains queries and exposed APIs called from the Frontend.
    - "server/interfaces": Contains server object interfaces.
    - "server/observers": Contains code for events/changes that occur in response to system messages.
    - "server/services": Contains implementations of queries called from the Frontend.
    - "server.router.ts": Contains the file that groups routes to the Backend's APIs.
- "src/test": Contains unit test scripts.
- "src/server.ts + src/webServer.ts": Entry points for the Node.js server.

## **NPM Packages Used by the Backend:**

- "sequelize" = Database abstraction.
- "sequelize-cli" = Allows executing scripts to initialize data in the database (seeders) or update the database structure (migrations) + see **[sequelize-cli commands](https://www.npmjs.com/package/sequelize-cli)** for more details.
- "express" = Basic web framework for Node.js.
- "mocha" = Testing framework for Node.js.
- ... (check package.json for more dependencies).

## **OpenAPI + Swagger:**

Specifications:

- Refer to the "// #swagger.XXX" comments in routers and controllers to specify APIs consistently.

Generation:

- Comment out the code in the "requirePermissions" method in "permissions.server.middleware.ts".
- Generate the .json files with "npm run swagger-autogen."
- When starting the project with "npm start," first log in to xt with the "xt" user, and then you can view the APIs with Swagger:
_ Database APIs: **http://localhost:5001/doc-database**. First, comment out the line containing the server URL ("/doc-server") in the "webServer.ts" file.
_ Server APIs: **http://localhost:5001/doc-server**. First, comment out the line containing the server URL ("/doc-database") in the "webServer.ts" file.
(You can view one configuration at a time)

## **Unit Tests:**

- Run "npm test" to execute all unit tests; the results will appear in the terminal. (The database and SQL tables will initialize the first time; you will need to rerun the tests for subsequent executions in the nominal case.)
Note: Currently, the tests for database APIs are commented out because they add data to the databases, which needs revision.

## **Databases:**

- xt has two databases (src/database/config/config.json): xtConfig (contains configuration tables) and xtExploit (contains exploitation tables).
- To restore or back up these databases, use the APIs in the src/database/controllers/database.controller.ts file.
- Database and table creation/authentications/migrations are managed in the src/database/config/sequelizeConnection.ts file.

## **Version Upgrades:**

- Modify the version number in the package.json file as desired (e.g., 1.0.0 -> 1.1.0 or 2.0.0).
- If needed, create a migration file for this version in src/database/migrations... and add functions to the migration dictionaries in the src/database/config/sequelizeConnection.ts file.

## **Deployment:**


