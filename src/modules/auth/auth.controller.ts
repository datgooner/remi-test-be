import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";

import { AuthService } from "./auth.service";
import { LoginDto } from "./dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post()
  async authenticate(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    return await this.authService.authenticate(loginDto);
  }
}
