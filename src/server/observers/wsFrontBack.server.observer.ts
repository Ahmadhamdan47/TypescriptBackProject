import { Server } from "http";
import { WebSocketServer } from "ws";
import { logger } from "../../../logger";
import { WebSocketCustom } from "../classes/webSocketCustom.server.class";
import { FrontEventServerInterface } from "../interfaces/event.server";
import { getUsernameFromToken } from "../interfaces/user.server";

const wsClientList: WebSocketCustom[] = [];

export interface Observer {
  notify(messages: FrontEventServerInterface[]): void;
}

export class WsFrontBackObserver implements Observer {
  constructor(protected server: Server) {
    this.manageWsBackFront(server);
  }

  manageWsBackFront(server: Server) {
    const wssClient = new WebSocketServer({
      server: server,
      path: "/ws/events",
    });

    wssClient.on("connection", wsConnection => {
      logger.info("WS front/back connected, waiting for username");
      // TODO Front needs to send token to WebSocket to connect
      wsConnection.on("message", function message(data) {
        if (data && data instanceof Buffer) {
          const dataMessage = JSON.parse(data.toString());
          const username = getUsernameFromToken(
            dataMessage.id_token,
            dataMessage.access_token
          );
          if (username) {
            wsClientList.push(new WebSocketCustom(username, wsConnection));
            logger.info(`WS front/back connected for user ${username}`);
          }
        }
      });
      wsConnection.on("close", () => {
        const index = wsClientList.findIndex(object => {
          return object.webSocket === wsConnection;
        });
        if (index !== -1) {
          logger.info(
            `WS front/back closed for user ${wsClientList[index].username}`
          );
          wsClientList.splice(index, 1);
        }
      });
    });
  }

  notify(messages: FrontEventServerInterface[]) {
    // TODO Update event for Front and send to user concerned
    messages.forEach(message => {
      wsClientList.forEach(wsClient => {
        // TODO filter event with username of custom WS
        wsClient.webSocket.send(JSON.stringify(message));
      });
    });
  }
}
