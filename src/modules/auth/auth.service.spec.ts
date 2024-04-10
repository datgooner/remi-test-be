import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "../user/user.service";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto";
import { BadRequestException } from "@nestjs/common";

const mockedToken = "mockedToken";

const mockedUser = {
  _id: "mockUserId",
  email: "test@example.com",
  password: "password",
  comparePassword: jest.fn(),
};

describe("AuthService", () => {
  let service: AuthService;
  let userService: UserService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: { getUserModelByEmail: jest.fn(), createUser: jest.fn() },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue(mockedToken),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  it("should return a JWT token if authentication is successful", async () => {
    const loginDto: LoginDto = {
      email: mockedUser.email,
      password: mockedUser.password,
    };
    (
      jest.spyOn(userService, "getUserModelByEmail") as jest.Mock
    ).mockReturnValue(mockedUser);
    mockedUser.comparePassword.mockReturnValue(true);
    const result = await service.authenticate(loginDto);
    expect(result.token).toBe(mockedToken);
  });

  it("should create a new user and return a JWT token if user does not exist", async () => {
    const loginDto: LoginDto = {
      email: mockedUser.email,
      password: mockedUser.password,
    };
    (
      jest.spyOn(userService, "getUserModelByEmail") as jest.Mock
    ).mockReturnValue(null);
    (jest.spyOn(userService, "createUser") as jest.Mock).mockReturnValue(
      mockedUser
    );
    const result = await service.authenticate(loginDto);
    expect(result.token).toBe(mockedToken);
  });

  it("should throw BadRequestException if password is invalid", async () => {
    const loginDto: LoginDto = {
      email: mockedUser.email,
      password: "wrongpassword",
    };

    (
      jest.spyOn(userService, "getUserModelByEmail") as jest.Mock
    ).mockReturnValue(mockedUser);
    mockedUser.comparePassword.mockResolvedValue(false);

    await expect(service.authenticate(loginDto)).rejects.toThrow(
      BadRequestException
    );
  });
});
