import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto";

describe("AuthController", () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            authenticate: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("authenticate", () => {
    it("should return a token when valid credentials are provided", async () => {
      const token = "some-token";
      jest.spyOn(authService, "authenticate").mockResolvedValueOnce({ token });

      const loginDto: LoginDto = {
        email: "test@example.com",
        password: "password123",
      };

      const result = await controller.authenticate(loginDto);

      expect(result).toEqual({ token });
    });
  });
});
