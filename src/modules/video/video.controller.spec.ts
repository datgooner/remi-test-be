import { QueryPaginationDto } from "@/common/dto/query-pagination.dto";
import { AuthGuard } from "@/guards";
import { Test, TestingModule } from "@nestjs/testing";
import { CreateVideoDto } from "./dto/create-video.dto";
import { VideoController } from "./video.controller";
import { VideoService } from "./video.service";

const mockUser = {
  _id: "mock_id",
  password: "password",
  email: "test@example.com",
};

const mockYoutubeVideo = {
  url: "https://www.youtube.com/embed/abc123",
  title: "Mock Video Title",
  description: "Mock Video Description",
  embedUrl: "https://www.youtube.com/embed/abc123",
  videoId: "abc123",
  createBy: mockUser,
};

describe("VideoController", () => {
  let controller: VideoController;
  let service: VideoService;

  const mockService = {
    createYoutubeVideo: jest.fn(() => mockYoutubeVideo),
    findAll: jest.fn(() => [mockYoutubeVideo]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VideoController],
      providers: [
        {
          provide: VideoService,
          useValue: mockService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: () => true,
      })
      .compile();

    controller = module.get<VideoController>(VideoController);
    service = module.get<VideoService>(VideoService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("createYoutubeVideo", () => {
    it("should create a new YouTube video", async () => {
      const createVideoDto: CreateVideoDto = {
        url: mockYoutubeVideo.url,
      };
      const req = {
        user: {
          userId: mockYoutubeVideo.createBy._id,
          email: mockYoutubeVideo.createBy.email,
        },
      };

      jest
        .spyOn(service, "createYoutubeVideo")
        .mockResolvedValueOnce(mockYoutubeVideo);

      const result = await controller.createYoutubeVideo(req, createVideoDto);

      expect(result).toBe(mockYoutubeVideo);
      expect(service.createYoutubeVideo).toHaveBeenCalledWith(
        createVideoDto,
        req.user.userId
      );
    });
  });

  describe("findAll", () => {
    it("should return an array of videos", async () => {
      const query: QueryPaginationDto = {
        // Provide necessary fields for query
      };
      const videos = []; // Mock the array of videos

      jest.spyOn(service, "findAll").mockResolvedValueOnce(videos);

      const result = await controller.findAll(query);

      expect(result).toBe(videos);
      expect(service.findAll).toHaveBeenCalledWith(query);
    });
  });
});
