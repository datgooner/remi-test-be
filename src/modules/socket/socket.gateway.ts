import { SocketEvent } from '@/constants';
import { Logger } from '@nestjs/common';
import {
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketService } from './socket.service';

@WebSocketGateway({ cors: '*', path: '/socket.io' })
export class SocketGateway implements OnGatewayInit {
  @WebSocketServer() server: Server;
  // TODO: update to use redis
  private connectedUsers: Map<string, string> = new Map();

  constructor(private readonly socketService: SocketService) {}

  handleConnection(client: Socket) {
    Logger.log('Client connected: ' + client.id);
  }

  handleDisconnect(client: Socket) {
    this.connectedUsers.delete(client.id);
    this.socketService.setConnectedUsers(this.connectedUsers);
    Logger.log('Client disconnected: ' + client.id);
  }

  @SubscribeMessage(SocketEvent.Message)
  handleMessage(client: Socket, payload: any): void {
    Logger.log('Received message from client: ' + payload);
  }

  @SubscribeMessage(SocketEvent.Authenticate)
  handleAuthentication(client: Socket, userId: string): void {
    this.connectedUsers.set(client.id, userId);
    this.socketService.setConnectedUsers(this.connectedUsers);

    Logger.log(
      `User ${userId} authenticated and mapped to socket ${client.id}`,
    );
  }

  afterInit(server: Server) {
    this.socketService.setServer(server);
    this.socketService.setConnectedUsers(this.connectedUsers);
  }
}
