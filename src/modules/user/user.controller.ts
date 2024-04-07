import { AuthGuard } from "@/guards";
import { Controller, Get, Request, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get("me")
  async getUserMe(@Request() req) {
    return await this.userService.getUserWithoutPasswordById(req.user.userId);
  }

  // We don't need those APIs for now
  // @Post()
  // async createUser(@Body() createUserDto: User): Promise<User> {
  //   return await this.userService.createUser(createUserDto);
  // }

  // @UseGuards(AuthGuard)
  // @Get()
  // async getAllUsers(): Promise<User[]> {
  //   return await this.userService.getAllUsers();
  // }

  // @Get(':id')
  // async getUserById(@Param('id') userId: string): Promise<User> {
  //   return await this.userService.getUserById(userId);
  // }

  // @Put(':id')
  // async updateUser(
  //   @Param('id') userId: string,
  //   @Body() updateUserDto: User,
  // ): Promise<User> {
  //   return await this.userService.updateUser(userId, updateUserDto);
  // }

  // @Delete(':id')
  // async deleteUser(@Param('id') userId: string): Promise<User> {
  //   return await this.userService.deleteUser(userId);
  // }
}
