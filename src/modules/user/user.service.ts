import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserModel } from "./user.model";

@Injectable()
export class UserService {
  constructor(@InjectModel("User") private readonly userModel: UserModel) {}

  async createUser(user: User) {
    return await this.userModel.create(user);
  }

  async getUserWithoutPasswordById(userId: string) {
    return await this.userModel.findById(userId, "-password");
  }

  async getUserModelByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }
}
