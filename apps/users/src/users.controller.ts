import { BadRequestException, Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  CreateUserRequest,
  DeleteUserRequest,
  GetUserRequest,
  UpdateUserRequest,
  UsersServiceController,
  UsersServiceControllerMethods,
} from '@app/common';

@Controller('users')
@UsersServiceControllerMethods()
export class UsersController implements UsersServiceController {
  constructor(private readonly usersService: UsersService) {}

  createUser(request: CreateUserRequest) {
    return this.usersService.createUser(request);
  }

  getUser(request: GetUserRequest) {
    return this.usersService.getUser(request.id);
  }

  updateUser(request: UpdateUserRequest) {
    if (!request.user) {
      throw new BadRequestException('Invalid user data');
    }

    return this.usersService.updateUser(request.user, request.user.id);
  }

  deleteUser(request: DeleteUserRequest) {
    return this.usersService.deleteUser(request.id);
  }
}
