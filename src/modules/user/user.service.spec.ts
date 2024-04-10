import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { UserService } from "./user.service";
import { User, UserModel } from "./user.model";

const mockUser = {
  _id: "mock_id",
  email: "test@example.com",
  password: "password123",
};

describe("UserService", () => {
  let service: UserService;
  let mockUserModel: Partial<UserModel>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken("User"),
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    mockUserModel = module.get(getModelToken("User"));
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("createUser", () => {
    it("should create a new user", async () => {
      const user: User = {
        email: mockUser.email,
        password: mockUser.password,
      };

      (mockUserModel.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.createUser(user);

      expect(mockUserModel.create).toHaveBeenCalledWith(user);
      expect(result).toEqual(mockUser);
    });
  });

  describe("getUserWithoutPasswordById", () => {
    it("should get a user by ID without the password", async () => {
      const userId = mockUser._id;
      const userWithoutPassword = {
        _id: mockUser._id,
        email: mockUser.email,
      };

      (mockUserModel.findById as jest.Mock).mockResolvedValue(
        userWithoutPassword
      );

      const result = await service.getUserWithoutPasswordById(userId);

      expect(mockUserModel.findById).toHaveBeenCalledWith(userId, "-password");
      expect(result).toEqual(userWithoutPassword);
    });
  });

  describe("getUserModelByEmail", () => {
    it("should get a user by email", async () => {
      const email = mockUser.email;

      (mockUserModel.findOne as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.getUserModelByEmail(email);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({ email });
      expect(result).toEqual(mockUser);
    });
  });
});
