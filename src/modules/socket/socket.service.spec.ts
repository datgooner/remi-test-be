import { SocketEvent } from "@/constants";
import { Test, TestingModule } from "@nestjs/testing";
import { Server, Socket } from "socket.io";
import { SocketService } from "./socket.service";

describe("SocketService", () => {
  let socketService: SocketService;
  let mockServer: Server;
  let mockSocket1: Partial<Socket>;
  let mockSocket2: Partial<Socket>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SocketService],
    }).compile();
    socketService = module.get<SocketService>(SocketService);
  });

  beforeEach(() => {
    mockSocket1 = {
      id: "mockSocketId1",
      data: {
        userId: "mockUserId1",
      },
      emit: jest.fn(),
    };
    mockSocket2 = {
      id: "mockSocketId2",
      data: {
        userId: "mockUserId2",
      },
      emit: jest.fn(),
    };

    mockServer = {
      emit: jest.fn(),
      fetchSockets: jest.fn(),
    } as unknown as Server;

    socketService.setServer(mockServer);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("emitEventToAll", () => {
    it("should emit event to all clients", () => {
      const eventName = SocketEvent.Notification;
      const eventData = { message: "testMessage" };
      socketService.emitEventToAll(eventName, eventData);
      expect(mockServer.emit).toHaveBeenCalledWith(eventName, eventData);
    });

    it("should throw error if server is not initialized", () => {
      socketService.setServer(undefined);
      expect(() =>
        socketService.emitEventToAll(SocketEvent.Notification, {})
      ).toThrow("Socket server is not initialized.");
    });
  });

  describe("emitEventToAllExceptUserIds", () => {
    it("should emit event to all clients except specified user ids", async () => {
      const eventName = SocketEvent.Notification;
      const eventData = { message: "testMessage" };
      const exceptUserIds = [mockSocket1.data.userId];
      mockServer.fetchSockets = jest
        .fn()
        .mockResolvedValueOnce([mockSocket1, mockSocket2]);
      await socketService.emitEventToAllExceptUserIds(
        eventName,
        eventData,
        exceptUserIds
      );
      expect(mockSocket1.emit).not.toHaveBeenCalledWith(eventName, eventData);
      expect(mockSocket2.emit).toHaveBeenCalledWith(eventName, eventData);
    });

    it("should throw error if server is not initialized", async () => {
      socketService.setServer(undefined);
      expect(
        socketService.emitEventToAllExceptUserIds(
          SocketEvent.Notification,
          {},
          []
        )
      ).rejects.toThrow("Socket server is not initialized.");
    });
  });
});
