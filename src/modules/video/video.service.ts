import { QueryPaginationDto } from '@/common/dto/query-pagination.dto';
import { SocketService } from '@/modules/socket/socket.service';
import { YoutubeVideoService } from '@/modules/youtube-video/youtube-video.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserService } from '../user/user.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { Video, VideoModel } from './video.model';
import { SocketEvent } from '@/constants';

@Injectable()
export class VideoService {
  constructor(
    @InjectModel('Video') private readonly videoModel: VideoModel,
    private readonly youtubeVideoService: YoutubeVideoService,
    private readonly userService: UserService,
    private readonly socketService: SocketService,
  ) {}
  async createYoutubeVideo(createVideoDto: CreateVideoDto, createById: string) {
    const createBy =
      await this.userService.getUserWithoutPasswordById(createById);
    const { url } = createVideoDto;
    const { isValid, videoId } = this.youtubeVideoService.parseYoutubeUrl(url);
    if (!isValid) {
      throw new BadRequestException('Invalid youtube video url');
    }

    const videoDetail =
      await this.youtubeVideoService.getYoutubeVideoByVideoId(videoId);
    const youtubeVideo: Video = {
      url,
      title: videoDetail.snippet.title,
      description: videoDetail.snippet.description,
      embedUrl: this.youtubeVideoService.getYoutubeEmbedUrl(videoId),
      videoId,
      createBy,
    };
    await this.videoModel.create(youtubeVideo);
    this.socketService.emitEventToAll(SocketEvent.Notification, {
      message: 'One new video has just been shared.',
      data: youtubeVideo,
    });
    return youtubeVideo;
  }

  async findAll(dto: QueryPaginationDto) {
    const { skip, limit } = dto;

    const count = await this.videoModel.countDocuments({}).exec();
    const totalPage = Math.floor((count - 1) / limit) + 1;
    const data = await this.videoModel
      .find()
      .populate('createBy', '-password')
      .limit(limit)
      .skip(skip)
      .sort({
        createdAt: 'desc',
      })
      .exec();
    return {
      items: data,
      totalPage,
      totalCount: count,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} video`;
  }
}
