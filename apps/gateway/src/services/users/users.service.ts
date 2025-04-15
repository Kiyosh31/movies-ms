import { Body, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  AuthenticateRequest,
  CreateUserRequest,
  UpdateUserRequest,
  USERS_SERVICE_NAME,
  UsersServiceClient,
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

  createUser(@Body() createUserDto: CreateUserRequest) {
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

  authenticate(request: AuthenticateRequest) {
    return this.usersService.authenticate(request);
  }
}
