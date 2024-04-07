import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import * as compression from 'compression';
import helmet from 'helmet';
import * as morgan from 'morgan';

import { AppModule } from './app.module';
import { API_PREFIX, API_VERSION } from './constants';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors(configService.get('app.cors'));

  app.setGlobalPrefix(`/${API_PREFIX}/${API_VERSION}`);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.use(helmet());
  app.use(compression());
  app.use(morgan('dev'));

  await app
    .listen(configService.get('app.port'), configService.get('app.host'))
    .then(() => {
      Logger.log(
        'Server listening on host ' +
          configService.get('app.host') +
          ':' +
          configService.get('app.port'),
      );
    });
}
bootstrap();
