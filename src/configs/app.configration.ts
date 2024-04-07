import { join } from 'path';

import * as dotenv from 'dotenv';
import Configuration from './app-cofiguration.interface';

dotenv.config({
  path: join(__dirname, '../../.env'),
});

export default (): Configuration => ({
  app: {
    name: process.env['APP_NAME'],
    method: process.env['APP_SERVER_METHOD'],
    host: process.env['APP_SERVER_HOST'],
    port: +process.env['PORT'],
    cors: {
      origin: process.env['SECURE_CORS_ORIGIN'],
      methods: process.env['SECURE_CORS_METHODS'],
      allowedHeaders: process.env['SECURE_CORS_ALLOWED_HEADERS'],
      exposedHeaders: process.env['SECURE_CORS_EXPOSED_HEADERS'],
    },
  },
  database: {
    mongo: {
      dbname: process.env['MONGO_DBNAME'],
      user: process.env['MONGO_USER'],
      password: process.env['MONGO_PASSWORD'],
      uri: `mongodb+srv://${process.env['MONGO_USER']}:${process.env['MONGO_PASSWORD']}@cluster0.j9vrnci.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
    },
  },
  security: {
    jwt: {
      secret: process.env['JWT_SECRET'],
      tokenExpiry: +process.env['JWT_TOKEN_EXPIRY'] ?? 300,
    },
  },
  network: {
    youtube: {
      baseUrl: process.env['YOUTUBE_API_BASE_URL'],
      apiKey: process.env['YOUTUBE_API_KEY'],
    },
  },
});
