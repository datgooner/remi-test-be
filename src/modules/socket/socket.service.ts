import { SocketEvent } from '@/constants';
import { Injectable, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@Injectable()
export class SocketService {
  private server: Server;
  private connectedUsers: Map<string, string>;

  public setServer(server: Server) {
    this.server = server;
  }

  public setConnectedUsers(_connectedUsers: Map<string, string>) {
    this.connectedUsers = _connectedUsers;
    console.log(
      '🚀 ~ SocketService ~ setConnectedUsers ~ this.connectedUsers:',
      this.connectedUsers,
    );
  }

  public emitEventToAll(eventName: SocketEvent, eventData: any) {
    if (!this.server) {
      throw new Error('Socket server is not initialized.');
    }

    this.server.emit(eventName, eventData);
  }

  public async emitEventToAllExceptUserIds(
    eventName: SocketEvent,
    eventData: any,
    exceptUserIds: string[],
  ) {
    if (!this.server) {
      throw new Error('Socket server is not initialized.');
    }
    const sockets = await this.server.fetchSockets();
    for (const socket of sockets) {
      if (exceptUserIds.includes(this.connectedUsers.get(socket.id))) {
        continue;
      }
      socket.emit(eventName, eventData);
      Logger.log('Emitted to: ', socket.id);
    }
  }

  public emitEventToClient(client: Socket, eventName: string, eventData: any) {
    client.emit(eventName, eventData);
  }
}
