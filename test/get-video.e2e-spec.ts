import { AppModule } from "@/app.module";
import { UserModel } from "@/modules/user/user.model";
import { VideoModel } from "@/modules/video/video.model";
import { closeMongoConnection } from "@/utils/test.utils";
import { INestApplication } from "@nestjs/common";
import { getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";

const mockUser = {
  email: "test@example.com",
  password: "password",
};
const createVideoDto = {
  url: "https://www.youtube.com/watch?v=abc123",
};

const mockVideoDetail = {
  id: "abc123",
  snippet: {
    title: "Mock Video Title",
    description: "Mock Video Description",
    publishedAt: "",
    channelId: "",
    thumbnails: [],
  },
};
const mockYoutubeVideo = {
  url: createVideoDto.url,
  title: mockVideoDetail.snippet.title,
  description: mockVideoDetail.snippet.description,
  embedUrl: "https://www.youtube.com/embed/abc123",
  videoId: "abc123",
};

describe("Get video (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const videoModel = app.get<VideoModel>(getModelToken("Video"));
    const userModel = app.get<UserModel>(getModelToken("User"));

    const user = await userModel.create(mockUser);
    const video = { ...mockYoutubeVideo, createBy: user };
    await videoModel.insertMany([video, video, video]);
  });

  afterAll(() => {
    closeMongoConnection();
    app.close();
  });

  it("should return all videos with correct pagination", async () => {
    const limit = 2;
    let skip = 0;
    const responsePage1 = await request(app.getHttpServer()).get(
      `/videos?limit=${limit}&skip=${skip}`
    );

    expect(responsePage1.status).toBe(200);
    expect(responsePage1.body.items.length).toBe(2);
    expect(responsePage1.body.totalPage).toBe(2);
    expect(responsePage1.body.totalCount).toBe(3);

    skip = 2;
    const responsePage2 = await request(app.getHttpServer()).get(
      `/videos?limit=${limit}&skip=${skip}`
    );

    expect(responsePage2.status).toBe(200);
    expect(responsePage2.body.items.length).toBe(1);
    expect(responsePage2.body.totalPage).toBe(2);
    expect(responsePage2.body.totalCount).toBe(3);
  });
});
