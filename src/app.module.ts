import { Module, ValidationPipe } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_PIPE } from "@nestjs/core";
import { MongooseModule } from "@nestjs/mongoose";
import configuration from "./configs/app.configration";
import { AuthModule } from "./modules/auth/auth.module";
import { UserModule } from "./modules/user/user.module";
import { YoutubeVideoModule } from "./modules/youtube-video/youtube-video.module";
import { VideoModule } from "./modules/video/video.module";
import { SocketModule } from "./modules/socket/socket.module";
import { HealthModule } from "./modules/health/health.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        return {
          uri: config.get("database.mongo.uri")!,
          dbName: config.get("database.mongo.dbname")!,
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    YoutubeVideoModule,
    VideoModule,
    SocketModule,
    HealthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
      }),
    },
  ],
})
export class AppModule {}
