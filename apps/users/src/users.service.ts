import { Injectable, OnModuleInit } from '@nestjs/common';
import { UsersRepository } from './repository/users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthenticateResponse, DeleteUserResponse, User } from '@app/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  onModuleInit() {}

  async userExists(email: string) {
    try {
      await this.userRepository.findOne({ email });
    } catch (e) {
      return;
    }
    throw new RpcException({
      code: status.ALREADY_EXISTS,
      message: 'Email already exists',
    });
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      await this.userExists(createUserDto.email);

      const userCreated = await this.userRepository.create({
        ...createUserDto,
        password: await bcrypt.hash(createUserDto.password, 10),
      });

      return {
        id: userCreated._id.toString(),
        firstName: userCreated.firstName,
        lastName: userCreated.lastName,
        email: userCreated.email,
        password: userCreated.password,
        role: userCreated.role,
      };
    } catch (err) {
      throw new RpcException({
        code: status.INTERNAL,
        message: err.message,
      });
    }
  }

  async getUser(_id: string): Promise<User> {
    try {
      const foundUser = await this.userRepository.findOne({ _id });
      if (!foundUser) {
        throw new RpcException({
          code: status.NOT_FOUND,
          message: 'User not found',
        });
      }

      return {
        id: foundUser._id.toString(),
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
        email: foundUser.email,
        password: foundUser.password,
        role: foundUser.role,
      };
    } catch (err) {
      throw new RpcException({
        code: status.INTERNAL,
        message: err.message,
      });
    }
  }

  async updateUser(updateUserDto: UpdateUserDto, _id: string): Promise<User> {
    try {
      const updatedUser = await this.userRepository.findOneAndUpdate(
        { _id },
        { $set: updateUserDto },
      );

      return {
        id: updatedUser._id.toString(),
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        password: updatedUser.password,
        role: updatedUser.role,
      };
    } catch (err) {
      throw new RpcException({
        code: status.INTERNAL,
        message: err.message,
      });
    }
  }

  async deleteUser(_id: string): Promise<DeleteUserResponse> {
    try {
      await this.userRepository.findOneAndDelete({ _id });

      return {};
    } catch (err) {
      throw new RpcException({
        code: status.INTERNAL,
        message: err.message,
      });
    }
  }

  async verifyJwt(token: string): Promise<any> {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (err) {
      throw new RpcException({
        code: status.INTERNAL,
        message: err.message,
      });
    }
  }

  async authenticate(
    email: string,
    password: string,
  ): Promise<AuthenticateResponse> {
    try {
      const user = await this.userRepository.findOne({ email });
      if (!user) {
        throw new RpcException({
          code: status.NOT_FOUND,
          message: "User doesn't exist",
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new RpcException({
          code: status.INTERNAL,
          message: 'Invalid password',
        });
      }

      const token = await this.jwtService.signAsync({
        sub: user._id.toString(),
        username: user.email,
        role: user.role,
      });

      return {
        token,
      };
    } catch (err) {
      throw new RpcException({
        code: status.INTERNAL,
        message: err.message,
      });
    }
  }
}
