// auth.e2e-spec.ts
import { AppModule } from "@/app.module";
import { closeMongoConnection } from "@/utils/test.utils";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";

describe("Authentication (e2e)", () => {
  let app: INestApplication;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    jwtService = moduleFixture.get<JwtService>(JwtService);
  });

  afterAll(async () => {
    await closeMongoConnection();
    await app.close();
  });

  it("should sign up success and return JWT token", async () => {
    const loginData = { email: "test@example.com", password: "password123" };

    const response = await request(app.getHttpServer())
      .post("/auth")
      .send(loginData)
      .expect(200);

    const decodedToken = jwtService.decode(response.body.token);
    expect(decodedToken).toMatchObject({ email: loginData.email });
  });

  it("should sign in success and return JWT token", async () => {
    const loginData = { email: "test@example.com", password: "password123" };

    const response = await request(app.getHttpServer())
      .post("/auth")
      .send(loginData)
      .expect(200);

    const decodedToken = jwtService.decode(response.body.token);
    expect(decodedToken).toMatchObject({ email: loginData.email });
  });

  it("should return 400 with invalid credentials", async () => {
    const invalidLoginData = {
      email: "test@example.com",
      password: "password_invalid",
    };

    await request(app.getHttpServer())
      .post("/auth")
      .send(invalidLoginData)
      .expect(400);
  });
});
