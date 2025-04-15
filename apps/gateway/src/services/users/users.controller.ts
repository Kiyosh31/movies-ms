import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { UpdateUserRequest } from '@app/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthenticateUserDto } from './dto/authenticate-user.dto';
import { catchError, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService
      .createUser(createUserDto)
      .pipe(catchError((error) => throwError(() => new RpcException(error))));
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getUser(@Param('id') id: string) {
    return this.usersService
      .getUser(id)
      .pipe(catchError((error) => throwError(() => new RpcException(error))));
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const updateUserRequest: UpdateUserRequest = {
      ...updateUserDto,
      id,
    };

    return this.usersService
      .updateUser(updateUserRequest)
      .pipe(catchError((error) => throwError(() => new RpcException(error))));
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteUser(@Param('id') id: string) {
    return this.usersService
      .deleteUser(id)
      .pipe(catchError((error) => throwError(() => new RpcException(error))));
  }

  @Post('auth')
  authenticate(@Body() authenticateUserDto: AuthenticateUserDto) {
    return this.usersService
      .authenticate(authenticateUserDto)
      .pipe(catchError((error) => throwError(() => new RpcException(error))));
  }
}
