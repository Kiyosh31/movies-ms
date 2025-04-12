import { IsEmail, IsStrongPassword } from 'class-validator';
import { CreateUserRequest } from '@app/common';

export class CreateUserDto implements CreateUserRequest {
  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;
}
