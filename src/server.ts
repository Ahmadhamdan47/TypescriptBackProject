import { logger } from "../logger";
import { WebServer } from "./webServer";

logger.info("About to start the server...");

(async () => {
  try {
    const server = new WebServer();
    await server.start();
  } catch (err) {
    logger.error(err);
  }
})();
