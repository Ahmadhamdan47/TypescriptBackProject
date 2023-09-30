import ws from "ws";

export class WebSocketCustom {
  constructor(protected pUsername: string, protected pWebSocket: ws.WebSocket) {
    this.username = pUsername;
    this.webSocket = pWebSocket;
  }

  username: string;
  webSocket: ws.WebSocket;
}
