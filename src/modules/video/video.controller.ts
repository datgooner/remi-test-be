import { QueryPaginationDto } from '@/common/dto/query-pagination.dto';
import { AuthGuard } from '@/guards';
import { JwtUserPayload } from '@/interfaces';
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { VideoService } from './video.service';

@Controller('videos')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @UseGuards(AuthGuard)
  @Post('youtube')
  createYoutubeVideo(
    @Request() req: { user: JwtUserPayload },
    @Body() createVideoDto: CreateVideoDto,
  ) {
    return this.videoService.createYoutubeVideo(
      createVideoDto,
      req.user.userId,
    );
  }

  @Get()
  findAll(@Query() dto: QueryPaginationDto) {
    return this.videoService.findAll(dto);
  }
}
