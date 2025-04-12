import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UsersRepository } from './repository/users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  AuthenticateResponse,
  CreateUserResponse,
  DeleteUserResponse,
  GetUserResponse,
  UpdateUserResponse,
} from '@app/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

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
    } catch (err) {
      return;
    }
    throw new UnprocessableEntityException('Email already exists');
  }

  async createUser(createUserDto: CreateUserDto): Promise<CreateUserResponse> {
    try {
      await this.userExists(createUserDto.email);

      const userCreated = await this.userRepository.create({
        ...createUserDto,
        password: await bcrypt.hash(createUserDto.password, 10),
      });

      if (!userCreated) {
        throw new Error('Error creating user');
      }

      return {
        user: {
          id: userCreated._id.toString(),
          email: userCreated.email,
          password: userCreated.password,
        },
      };
    } catch (err) {
      throw new Error(err);
    }
  }

  async getUser(_id: string): Promise<GetUserResponse> {
    try {
      const findedUser = await this.userRepository.findOne({ _id });
      if (!findedUser) {
        throw new NotFoundException('User not found');
      }

      return {
        user: {
          id: findedUser._id.toString(),
          email: findedUser.email,
          password: findedUser.password,
        },
      };
    } catch (err) {
      throw new Error(err);
    }
  }

  async updateUser(
    updateUserDto: UpdateUserDto,
    _id: string,
  ): Promise<UpdateUserResponse> {
    try {
      const updatedUser = await this.userRepository.findOneAndUpdate(
        { _id },
        { $set: updateUserDto },
      );

      return {
        user: {
          id: updatedUser._id.toString(),
          email: updatedUser.email,
          password: updatedUser.password,
        },
      };
    } catch (err) {
      throw new Error(err);
    }
  }

  async deleteUser(_id: string): Promise<DeleteUserResponse> {
    try {
      await this.userRepository.findOneAndDelete({ _id });

      return {};
    } catch (err) {
      throw new Error(err);
    }
  }

  async generateJwt(payload: {
    sub: string;
    username: string;
  }): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  async verifyJwt(token: string): Promise<any> {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (err) {
      throw new BadRequestException('Invalid token: ', err);
    }
  }

  async authenticate(
    email: string,
    password: string,
  ): Promise<AuthenticateResponse> {
    try {
      const user = await this.userRepository.findOne({ email });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new BadRequestException('Invalid password');
      }

      const payload = { sub: user._id.toString(), username: user.email };
      const token = await this.generateJwt(payload);
      return {
        token,
      };
    } catch (e) {
      throw new Error(e);
    }
  }
}
