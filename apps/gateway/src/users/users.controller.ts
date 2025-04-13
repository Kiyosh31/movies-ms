import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  AuthenticateRequest,
  CreateUserRequest,
  UpdateUserRequest,
} from '@app/common';

@Controller('users')
// @UseGuards(RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserRequest) {
    return this.usersService.create(createUserDto);
  }

  @Get(':id')
  // @Roles(Role.User, Role.Admin)
  getUser(@Param('id') id: string) {
    return this.usersService.getUser(id);
  }

  @Patch(':id')
  updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserRequest,
  ) {
    updateUserDto.id = id;
    return this.usersService.updateUser(updateUserDto);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }

  @Post('/auth')
  authenticate(@Body() request: AuthenticateRequest) {
    return this.usersService.authenticate(request.email, request.password);
  }
}
