import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { UsersRepository } from './repository/users.repository';
import {
  CreateUserRequest,
  EVENT_CREATE_NOTIFICATION,
  UpdateUserRequest,
} from '@app/common';
import {
  AuthenticateResponse,
  DeleteUserResponse,
  User,
  VerifyJwtResponse,
} from '@app/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { NOTIFICATIONS_QUEUE_SERVICE } from '@app/common';
import { UserDocument } from './models/user.schema';
import { ConfigService } from '@nestjs/config';
import { CreateNotificationDto } from '@app/common';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: UsersRepository,
    private readonly jwtService: JwtService,
    @Inject(NOTIFICATIONS_QUEUE_SERVICE) private rabbitMqClient: ClientProxy,
  ) {}

  onModuleInit() {}

  mapUserDocumentToDto(user: UserDocument): User {
    return {
      id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      role: user.role,
    };
  }

  private handleDatabaseError(error: any): RpcException {
    return new RpcException({
      code: status.INTERNAL,
      message: error.message || 'Database error occurred',
    });
  }

  private async userExists(email: string) {
    try {
      await this.userRepository.findOne({ email });
    } catch {
      return;
    }

    throw new RpcException({
      code: status.ALREADY_EXISTS,
      message: 'User already exists',
    });
  }

  async createUser(createUserRequest: CreateUserRequest): Promise<User> {
    try {
      await this.userExists(createUserRequest.email);

      const userCreated = await this.userRepository.create({
        ...createUserRequest,
        password: await bcrypt.hash(createUserRequest.password, 10),
      });

      const rabbitMqPayload: CreateNotificationDto = {
        userId: userCreated._id.toString(),
        message: 'User created',
        data: this.mapUserDocumentToDto(userCreated),
      };

      this.rabbitMqClient.emit(EVENT_CREATE_NOTIFICATION, rabbitMqPayload);

      return this.mapUserDocumentToDto(userCreated);
    } catch (err) {
      if (err instanceof RpcException) {
        throw err;
      }

      throw this.handleDatabaseError(err);
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

      return this.mapUserDocumentToDto(foundUser);
    } catch (err) {
      if (err instanceof RpcException) {
        throw err;
      }

      throw this.handleDatabaseError(err);
    }
  }

  async updateUser(updateUserDto: UpdateUserRequest): Promise<User> {
    try {
      const updatedUser = await this.userRepository.findOneAndUpdate(
        { _id: updateUserDto.id },
        { $set: updateUserDto },
      );

      const rabbitMqPayload: CreateNotificationDto = {
        userId: updatedUser._id.toString(),
        message: 'User updated',
        data: this.mapUserDocumentToDto(updatedUser),
      };
      this.rabbitMqClient.emit(EVENT_CREATE_NOTIFICATION, rabbitMqPayload);

      return this.mapUserDocumentToDto(updatedUser);
    } catch (err) {
      if (err instanceof RpcException) {
        throw err;
      }

      throw this.handleDatabaseError(err);
    }
  }

  async deleteUser(_id: string): Promise<DeleteUserResponse> {
    try {
      const deletedUser = await this.userRepository.findOneAndDelete({ _id });

      const rabbitMqPayload: CreateNotificationDto = {
        userId: deletedUser._id.toString(),
        message: 'User deleted',
        data: null,
      };
      this.rabbitMqClient.emit(EVENT_CREATE_NOTIFICATION, rabbitMqPayload);

      return {};
    } catch (err) {
      if (err instanceof RpcException) {
        throw err;
      }

      throw this.handleDatabaseError(err);
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
      if (err instanceof RpcException) {
        throw err;
      }

      throw this.handleDatabaseError(err);
    }
  }

  async verifyJwt(token: string): Promise<VerifyJwtResponse> {
    const secret = this.configService.getOrThrow<string>('JWT_SECRET');
    if (!secret) {
      console.error('JWT_SECRET no configurado en el User Service');
      return { isValid: false, user: undefined };
    }

    try {
      const decoded = await this.jwtService.verify(token, { secret });

      const user = await this.userRepository.findOne({ _id: decoded.sub });
      return {
        isValid: true,
        user: this.mapUserDocumentToDto(user),
      };
    } catch {
      return {
        isValid: false,
        user: undefined,
      };
    }
  }
}
