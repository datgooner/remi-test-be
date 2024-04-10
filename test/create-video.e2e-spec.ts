import { AppModule } from "@/app.module";
import { SocketEvent } from "@/constants";
import { AuthGuard } from "@/guards";
import { SocketService } from "@/modules/socket/socket.service";
import { CreateVideoDto } from "@/modules/video/dto/create-video.dto";
import { closeMongoConnection } from "@/utils/test.utils";
import { ExecutionContext, INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { createServer } from "http";
import * as mongoose from "mongoose";
import { AddressInfo } from "net";
import { Server } from "socket.io";
import { io as ioc, type Socket as ClientSocket } from "socket.io-client";
import * as request from "supertest";

const userId = mongoose.Types.ObjectId.generate();
const mockTokenPayload = {
  userId,
  email: "test@example.com",
};

describe("Create a Video (e2e)", () => {
  let app: INestApplication;
  let socketService: SocketService;
  let io: Server, clientSocket: ClientSocket;
  const notificationCallback = jest.fn();

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = mockTokenPayload;
          return true;
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    socketService = moduleFixture.get(SocketService);

    // init mock socket connection
    const httpServer = createServer();
    io = new Server(httpServer);
    socketService.setServer(io);
    await new Promise((resolve) => {
      httpServer.listen(() => {
        const port = (httpServer.address() as AddressInfo).port;
        clientSocket = ioc(`http://localhost:${port}`);
        clientSocket.on("connect", () => {
          resolve(true);
        });
        clientSocket.on(SocketEvent.Notification, notificationCallback);
      });
    });
  });

  afterAll(() => {
    closeMongoConnection();
    app.close();
    io.close();
    clientSocket.close();
  });

  it("should create youtube video successfully with valid url", async () => {
    const createVideoDto: CreateVideoDto = {
      url: "https://www.youtube.com/watch?v=NS-iWkxIbWI", // a valid YouTube URL
    };

    const response = await request(app.getHttpServer())
      .post("/videos/youtube")
      .send(createVideoDto);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      url: createVideoDto.url,
      videoId: "NS-iWkxIbWI",
    });
  });

  it("should send notification after creating success", async () => {
    const createVideoDto: CreateVideoDto = {
      url: "https://www.youtube.com/watch?v=NS-iWkxIbWI", // a valid YouTube URL
    };

    const response = await request(app.getHttpServer())
      .post("/videos/youtube")
      .send(createVideoDto);

    expect(response.status).toBe(201);
    expect(notificationCallback).toHaveBeenCalledWith({
      message: "One new video has just been shared.",
      data: expect.objectContaining({
        url: createVideoDto.url,
      }),
    });
  });

  it("should throw error with invalid url", async () => {
    const createVideoDto: CreateVideoDto = {
      url: "https://www.youtube.com/watch?v=invalid", // a invalid YouTube URL
    };

    const response = await request(app.getHttpServer())
      .post("/videos/youtube")
      .send(createVideoDto);

    expect(response.status).toBe(400);
  });
});
