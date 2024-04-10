import { AppModule } from "@/app.module";
import { closeMongoConnection } from "@/utils/test.utils";
import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";

describe("AppController (e2e)", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("Health Check [GET /health]", () => {
    return request(app.getHttpServer()).get("/health").expect(200);
  });

  afterAll(async () => {
    await closeMongoConnection();
    await app.close();
  });
});
