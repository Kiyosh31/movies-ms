import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { UpdateUserRequest } from '@app/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthenticateUserDto } from './dto/authenticate-user.dto';
import { catchError, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    try {
      return this.usersService.createUser(createUserDto);
    } catch (err) {
      throw new RpcException(err);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getUser(@Param('id') id: string, @Req() req: Request) {
    try {
      return await this.usersService.getUser(id, req['user'].id);
    } catch (err) {
      throw new RpcException(err);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request,
  ) {
    const updateUserRequest: UpdateUserRequest = {
      ...updateUserDto,
      id,
    };

    try {
      return await this.usersService.updateUser(
        updateUserRequest,
        req['user'].id,
      );
    } catch (err) {
      throw new RpcException(err);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Param('id') id: string, @Req() req: Request) {
    try {
      return await this.usersService.deleteUser(id, req['user'].id);
    } catch (err) {
      throw new RpcException(err);
    }
  }

  @Post('auth')
  authenticate(@Body() authenticateUserDto: AuthenticateUserDto) {
    return this.usersService
      .authenticate(authenticateUserDto)
      .pipe(catchError((error) => throwError(() => new RpcException(error))));
  }
}
