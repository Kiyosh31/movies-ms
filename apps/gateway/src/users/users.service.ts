import { Body, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { USERS_SERVICE_NAME, UsersServiceClient } from '@app/common';
import { ClientGrpc } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-seru.dto';

@Injectable()
export class UsersService implements OnModuleInit {
  private usersService: UsersServiceClient;

  constructor(@Inject(USERS_SERVICE_NAME) private client: ClientGrpc) {}

  onModuleInit() {
    this.usersService =
      this.client.getService<UsersServiceClient>(USERS_SERVICE_NAME);
  }

  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  getUser(id: string) {
    return `This action returns a #${id} user`;
  }

  updateUser(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user ${updateUserDto.email}`;
  }

  deleteUser(id: string) {
    return `This action removes a #${id} user`;
  }
}
