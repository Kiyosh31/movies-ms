import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  AuthenticateRequest,
  CreateUserRequest,
  DeleteUserRequest,
  GetUserRequest,
  UpdateUserRequest,
  UsersServiceController,
  UsersServiceControllerMethods,
  VerifyJwtRequest,
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
    return this.usersService.updateUser(request);
  }

  deleteUser(request: DeleteUserRequest) {
    return this.usersService.deleteUser(request.id);
  }

  authenticate(request: AuthenticateRequest) {
    return this.usersService.authenticate(request.email, request.password);
  }

  verifyJwt(request: VerifyJwtRequest) {
    return this.usersService.verifyJwt(request.token);
  }
}
