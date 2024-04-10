import { BadRequestException, Inject, Injectable } from "@nestjs/common";

import { LoginDto } from "./dto";

import { CREDENTIALS_INVALID } from "@/constants";
import { UserService } from "@/modules/user/user.service";
import { JwtService } from "@nestjs/jwt";
import { JwtUserPayload } from "@/interfaces";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    @Inject(JwtService)
    private readonly jwtService: JwtService
  ) {}

  /**
   * Access login or register with email and password.
   * @returns a JWT if authenticated.
   */
  async authenticate(loginDto: LoginDto) {
    const { email, password } = loginDto;

    let userExisted = await this.userService.getUserModelByEmail(email);
    let isRegistration = true;

    if (!userExisted) {
      const user = { email, password };
      userExisted = await this.userService.createUser(user);
    } else {
      isRegistration = false;
      try {
        const match = await userExisted.comparePassword(password);
        if (!match) {
          throw new Error();
        }
      } catch (error) {
        throw new BadRequestException(CREDENTIALS_INVALID);
      }
    }
    const payload: JwtUserPayload = {
      email: userExisted.email,
      userId: String(userExisted._id),
    };
    return {
      token: this.jwtService.sign(payload),
      message: isRegistration
        ? "Registered successfully"
        : "Login successfully",
    };
  }
}
