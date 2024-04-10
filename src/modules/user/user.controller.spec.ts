import { Test, TestingModule } from "@nestjs/testing";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

const mockUser = {
  _id: "mock_id",
  email: "test@example.com",
  password: "password123",
};

describe("UserController", () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            getUserWithoutPasswordById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("getUserMe", () => {
    it("should return user data without password", async () => {
      const userWithoutPassword = {
        _id: mockUser._id,
        email: mockUser.email,
      };
      const req = { user: { userId: mockUser._id } };

      (userService.getUserWithoutPasswordById as jest.Mock).mockResolvedValue(
        userWithoutPassword
      );

      const result = await controller.getUserMe(req);

      expect(userService.getUserWithoutPasswordById).toHaveBeenCalledWith(
        mockUser._id
      );
      expect(result).toEqual(userWithoutPassword);
    });
  });
});
