import {
  Body,
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
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

  async checkOwnership(userId: string, jwtUserId: string) {
    const user = await this.usersService.getUser({ id: userId }).toPromise();

    if (user?.id !== jwtUserId) {
      throw new UnauthorizedException(
        'You dont have permission to access this resource',
      );
    }

    return;
  }

  createUser(@Body() createUserDto: CreateUserRequest) {
    return this.usersService.createUser(createUserDto);
  }

  async getUser(id: string, jwtUserId: string) {
    await this.checkOwnership(id, jwtUserId);
    return this.usersService.getUser({ id });
  }

  async updateUser(updateUserDto: UpdateUserRequest, jwtUserId: string) {
    await this.checkOwnership(updateUserDto.id, jwtUserId);
    return this.usersService.updateUser(updateUserDto);
  }

  async deleteUser(id: string, jwtUserId: string) {
    await this.checkOwnership(id, jwtUserId);
    return this.usersService.deleteUser({ id });
  }

  authenticate(request: AuthenticateRequest) {
    return this.usersService.authenticate(request);
  }
}
