import { Body, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  CreateUserRequest,
  UpdateUserRequest,
  USERS_SERVICE_NAME,
  UsersServiceClient,
  VerifyJwtRequest,
} from '@app/common';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class UsersService implements OnModuleInit {
  private usersService: UsersServiceClient;

  constructor(@Inject(USERS_SERVICE_NAME) private client: ClientGrpc) {}

  onModuleInit() {
    this.usersService =
      this.client.getService<UsersServiceClient>(USERS_SERVICE_NAME);
  }

  create(@Body() createUserDto: CreateUserRequest) {
    return this.usersService.createUser(createUserDto);
  }

  getUser(id: string) {
    return this.usersService.getUser({ id });
  }

  updateUser(updateUserDto: UpdateUserRequest) {
    return this.usersService.updateUser(updateUserDto);
  }

  deleteUser(id: string) {
    return this.usersService.deleteUser({ id });
  }

  authenticate(email: string, password: string) {
    return this.usersService.authenticate({ email, password });
  }
}
