import { Module } from "@nestjs/common";
import { VideoService } from "./video.service";
import { VideoController } from "./video.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { VideoSchema } from "./video.model";
import { YoutubeVideoModule } from "@/modules/youtube-video/youtube-video.module";
import { UserModule } from "@/modules/user/user.module";
import { SocketModule } from "@/modules/socket/socket.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Video", schema: VideoSchema }]),
    YoutubeVideoModule,
    UserModule,
    SocketModule,
  ],
  controllers: [VideoController],
  providers: [VideoService],
  exports: [VideoService],
})
export class VideoModule {}
