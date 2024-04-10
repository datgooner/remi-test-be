import { IsEmail, IsString, MinLength } from "class-validator";

export class LoginDto {
  @IsEmail(
    {},
    {
      message: "Invalid Email",
    }
  )
  email: string;

  @IsString({ message: "Password must be a string" })
  @MinLength(8, { message: "Password must have at least 8 characters" })
  password: string;
}
