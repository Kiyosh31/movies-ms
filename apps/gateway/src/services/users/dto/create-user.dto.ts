import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateUserRequest } from '@app/common';

export class CreateUserDto implements CreateUserRequest {
  @IsNotEmpty()
  @IsString()
  firstName!: string;

  @IsNotEmpty()
  @IsString()
  lastName!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  password!: string;

  @IsString()
  @IsOptional()
  role!: string;
}
