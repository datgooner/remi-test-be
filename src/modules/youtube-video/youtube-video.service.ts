import {
  YoutubeVideoDetailResponse,
  YoutubeVideoDetail,
} from '@/interfaces/youtube-api.interface';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import * as urlModule from 'url';

@Injectable()
export class YoutubeVideoService {
  baseURL?: string;
  apiKey?: string;
  instance?: AxiosInstance;

  constructor(private readonly configService: ConfigService) {
    this.baseURL = configService.get('network.youtube.baseUrl');
    this.apiKey = configService.get('network.youtube.apiKey');
  }

  /**
   * Lazy-loading axios ${@link instance}.
   */
  private getInstance(): AxiosInstance {
    if (this.instance) return this.instance;
    this.instance = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      maxBodyLength: Infinity,
      timeout: 5000, // 5 seconds
    });
    return this.instance;
  }

  private buildAuthorizeParams(params: any) {
    return { ...params, key: this.apiKey };
  }

  async getYoutubeVideoByVideoId(videoId: string): Promise<YoutubeVideoDetail> {
    // https://developers.google.com/youtube/v3/docs/videos
    const params = {
      id: videoId,
      fields: 'items(id,snippet,statistics)',
      part: 'snippet,statistics',
    };
    try {
      const videoResponse =
        await this.getInstance().get<YoutubeVideoDetailResponse>('/videos', {
          params: this.buildAuthorizeParams(params),
        });
      const videoItems = videoResponse.data?.items;
      if (!videoItems?.length) {
        throw new Error();
      }

      const video = videoItems[0];

      return video;
    } catch (error) {
      throw new BadRequestException('Invalid video');
    }
  }

  parseYoutubeUrl(url: string): { isValid: boolean; videoId?: string } {
    // Example
    // https://www.youtube.com/watch?v=vDWf50tdoyQ
    // https://youtu.be/vDWf50tdoyQ?si=YckQoPQ1Pe0NPF4O
    const validStarts = ['https://www.youtube.com', 'https://youtu.be'];
    const isStartWithNormalLink = url.startsWith(validStarts[0]);
    const isStartWithShortenLink = url.startsWith(validStarts[1]);
    const isValidStart = isStartWithNormalLink || isStartWithShortenLink;
    if (!isValidStart) {
      return { isValid: false };
    }
    const parsedUrl = urlModule.parse(url, true);

    if (isStartWithNormalLink) {
      const videoId = parsedUrl.query.v as string;
      return { videoId, isValid: true };
    }

    if (isStartWithShortenLink) {
      const videoId = parsedUrl.pathname.replace('/', '');
      return { videoId, isValid: true };
    }
  }

  getYoutubeEmbedUrl(videoId: string) {
    return `https://www.youtube.com/embed/${videoId}`;
  }
}
