import { Test, TestingModule } from '@nestjs/testing';
import { YoutubeVideoService } from './youtube-video.service';

describe('YoutubeVideoService', () => {
  let service: YoutubeVideoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [YoutubeVideoService],
    }).compile();

    service = module.get<YoutubeVideoService>(YoutubeVideoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
