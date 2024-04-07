import { join } from 'path';

import * as dotenv from 'dotenv';
import Configuration from './app-cofiguration.interface';

dotenv.config({
  path: join(__dirname, '../../.env'),
});

export default (): Configuration => ({
  app: {
    name: process.env['APP.NAME'],
    method: process.env['APP.SERVER.METHOD'],
    host: process.env['APP.SERVER.HOST'],
    port: +process.env['APP.SERVER.PORT'],
    cors: {
      origin: process.env['SECURE.CORS.ORIGIN'],
      methods: process.env['SECURE.CORS.METHODS'],
      allowedHeaders: process.env['SECURE.CORS.ALLOWED_HEADERS'],
      exposedHeaders: process.env['SECURE.CORS.EXPOSED_HEADERS'],
    },
  },
  database: {
    mongo: {
      dbname: process.env['MONGO.DBNAME'],
      user: process.env['MONGO.USER'],
      password: process.env['MONGO.PASSWORD'],
      uri: `mongodb+srv://${process.env['MONGO.USER']}:${process.env['MONGO.PASSWORD']}@cluster0.j9vrnci.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
    },
  },
  security: {
    jwt: {
      secret: process.env['JWT.SECRET'],
      tokenExpiry: +process.env['JWT.TOKEN_EXPIRY'] ?? 300,
    },
  },
  network: {
    youtube: {
      baseUrl: process.env['YOUTUBE.API_BASE_URL'],
      apiKey: process.env['YOUTUBE.API_KEY'],
    },
  },
});
