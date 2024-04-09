import { Test, TestingModule } from "@nestjs/testing";
import { YoutubeVideoService } from "./youtube-video.service";
import { ConfigService } from "@nestjs/config";
import axios from "axios";
import { BadRequestException } from "@nestjs/common";

jest.mock("axios");

describe("YoutubeVideoService", () => {
  let service: YoutubeVideoService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
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
      ],
    }).compile();

    service = module.get<YoutubeVideoService>(YoutubeVideoService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
    expect(configService).toBeDefined();
  });

  describe("getYoutubeVideoByVideoId", () => {
    it("should fetch and return video details", async () => {
      const mockVideoId = "mocked_video_id";
      const mockResponse = {
        data: {
          items: [{ id: "mocked_video_id", snippet: {}, statistics: {} }],
        },
      };
      (axios.create as jest.Mock).mockReturnValueOnce({
        get: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await service.getYoutubeVideoByVideoId(mockVideoId);

      expect(result).toEqual(mockResponse.data.items[0]);
    });

    it("should throw BadRequestException if video is invalid", async () => {
      const mockVideoId = "invalid_video_id";
      const mockResponse = {
        data: {
          items: [],
        },
      };
      (axios.create as jest.Mock).mockReturnValueOnce({
        get: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      await expect(
        service.getYoutubeVideoByVideoId(mockVideoId)
      ).rejects.toThrowError(BadRequestException);
    });
  });

  describe("parseYoutubeUrl", () => {
    it("should parse and return valid videoId", () => {
      const validUrls = [
        "https://www.youtube.com/watch?v=mocked_video_id",
        "https://youtu.be/mocked_video_id?si=YckQoPQ1Pe0NPF4O",
      ];

      validUrls.forEach((url) => {
        const result = service.parseYoutubeUrl(url);
        expect(result.isValid).toBeTruthy();
        expect(result.videoId).toEqual("mocked_video_id");
      });
    });

    it("should return isValid false for invalid url", () => {
      const invalidUrl = "https://example.com";
      const result = service.parseYoutubeUrl(invalidUrl);
      expect(result.isValid).toBeFalsy();
    });
  });

  describe("getYoutubeEmbedUrl", () => {
    it("should return valid embed URL", () => {
      const mockVideoId = "mocked_video_id";
      const expectedUrl = "https://www.youtube.com/embed/mocked_video_id";
      const result = service.getYoutubeEmbedUrl(mockVideoId);
      expect(result).toEqual(expectedUrl);
    });
  });
});
