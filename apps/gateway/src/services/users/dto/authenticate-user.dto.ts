import { AuthenticateRequest } from '@app/common';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthenticateUserDto implements AuthenticateRequest {
  @IsNotEmpty()
  @IsString()
  email!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;
}
