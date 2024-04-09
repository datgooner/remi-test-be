import { SocketService } from "@/modules/socket/socket.service";
import { YoutubeVideoService } from "@/modules/youtube-video/youtube-video.service";
import { BadRequestException } from "@nestjs/common";
import { getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "../user/user.service";
import { VideoModel } from "./video.model";
import { VideoService } from "./video.service";
import { ConfigService } from "@nestjs/config";

const mockUser = {
  _id: "mock id",
  email: "test@example.com",
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
  createBy: mockUser,
};

describe("VideoService", () => {
  let service: VideoService;
  let videoModel: VideoModel;
  let youtubeVideoService: YoutubeVideoService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getModelToken("Video"),
          useValue: {
            create: jest.fn(() => mockYoutubeVideo),
            countDocuments: jest.fn(),
            find: jest.fn(),
          },
        },
        YoutubeVideoService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === "network.youtube.baseUrl") return "mocked_base_url";
              if (key === "network.youtube.apiKey") return "mocked_api_key";
            }),
          },
        },
        {
          provide: SocketService,
          useValue: {
            emitEventToAll: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            getUserWithoutPasswordById: jest.fn(() => mockUser),
          },
        },
        VideoService,
      ],
    }).compile();

    service = module.get<VideoService>(VideoService);
    videoModel = module.get<VideoModel>(getModelToken("Video"));
    youtubeVideoService = module.get<YoutubeVideoService>(YoutubeVideoService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("createYoutubeVideo", () => {
    it("should create a new video", async () => {
      jest
        .spyOn(youtubeVideoService, "getYoutubeVideoByVideoId")
        .mockResolvedValue(mockVideoDetail);
      const result = await service.createYoutubeVideo(
        createVideoDto,
        "createById"
      );
      expect(result).toEqual(mockYoutubeVideo);
    });

    it("should throw BadRequestException for invalid youtube video url", async () => {
      const createVideoDto = {
        url: "invalid_url",
      };
      jest
        .spyOn(youtubeVideoService, "getYoutubeVideoByVideoId")
        .mockRejectedValue(false);

      await expect(
        service.createYoutubeVideo(createVideoDto, "createById")
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe("findAll", () => {
    it("should find and return videos with pagination", async () => {
      const dto = {
        skip: 0,
        limit: 10,
      };
      const mockVideos = [
        { _id: "1", title: "Video 1" },
        { _id: "2", title: "Video 2" },
      ];
      (jest.spyOn(videoModel, "countDocuments") as jest.Mock)
        .mockReturnThis()
        .mockReturnValue({
          exec: jest.fn().mockResolvedValue(2),
        });
      (jest.spyOn(videoModel, "find") as jest.Mock).mockReturnValueOnce({
        populate: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValueOnce(mockVideos),
      });

      const result = await service.findAll(dto);

      expect(result.items).toEqual(mockVideos);
      expect(result.totalPage).toEqual(1);
      expect(result.totalCount).toEqual(2);
    });
  });

  describe("findOne", () => {
    it("should find and return a video by id", () => {
      const id = "1";

      const result = service.findOne(id);

      expect(result).toEqual(`This action returns a #${id} video`);
    });
  });
});
