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
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

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
    if (!request) {
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: 'Invalid user data',
      });
    }

    return this.usersService.updateUser(request, request.id);
  }

  deleteUser(request: DeleteUserRequest) {
    return this.usersService.deleteUser(request.id);
  }

  authenticate(request: AuthenticateRequest) {
    if (!request.email || !request.password) {
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: 'Invalid user data',
      });
    }

    return this.usersService.authenticate(request.email, request.password);
  }

  verifyJwt(request: VerifyJwtRequest) {
    return this.usersService.verifyJwt(request.token);
  }
}
