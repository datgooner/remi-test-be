import { SocketEvent } from "@/constants";
import { Injectable, Logger } from "@nestjs/common";
import { Server } from "socket.io";

@Injectable()
export class SocketService {
  private server: Server;

  public setServer(server: Server) {
    this.server = server;
  }

  public emitEventToAll(eventName: SocketEvent, eventData: any) {
    if (!this.server) {
      throw new Error("Socket server is not initialized.");
    }

    this.server.emit(eventName, eventData);
    Logger.log("Emitted to all");
  }

  public async emitEventToAllExceptUserIds(
    eventName: SocketEvent,
    eventData: any,
    exceptUserIds: string[]
  ) {
    if (!this.server) {
      throw new Error("Socket server is not initialized.");
    }
    const sockets = await this.server.fetchSockets();
    for (const socket of sockets) {
      if (exceptUserIds.includes(socket.data.userId)) {
        Logger.log("Skipped Emitting to: " + socket.id);
        Logger.log("Skipped Emitting to user id: " + socket.data.userId);
        continue;
      }
      socket.emit(eventName, eventData);
      Logger.log("Emitted to: ", socket.id);
    }
  }
}
