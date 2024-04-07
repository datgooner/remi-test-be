import { IsEmail } from 'class-validator';

export class LoginDto {
  @IsEmail(
    {},
    {
      message: 'Invalid Email',
    },
  )
  email: string;

  password: string;
}
