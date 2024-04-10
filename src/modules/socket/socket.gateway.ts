import { SocketEvent } from "@/constants";
import { Logger } from "@nestjs/common";
import {
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { SocketService } from "./socket.service";

@WebSocketGateway({ cors: "*", path: "/socket.io" })
export class SocketGateway implements OnGatewayInit {
  @WebSocketServer() server: Server;

  constructor(private readonly socketService: SocketService) {}

  handleConnection(client: Socket) {
    Logger.log("Client connected: " + client.id);
    Logger.log("Client connected user id: " + client.handshake.query.userId);
    client.data.userId = client.handshake.query.userId;
  }

  handleDisconnect(client: Socket) {
    Logger.log("Client disconnected: " + client.id);
  }

  @SubscribeMessage(SocketEvent.Message)
  handleMessage(client: Socket, payload: any): void {
    Logger.log("Received message from client: " + payload);
  }

  afterInit(server: Server) {
    this.socketService.setServer(server);
  }
}
