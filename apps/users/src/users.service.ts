import {
  Injectable,
  NotFoundException,
  OnModuleInit,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UsersRepository } from './repository/users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  CreateUserResponse,
  DeleteUserResponse,
  GetUserResponse,
  UpdateUserResponse,
} from '@app/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(private readonly userRepository: UsersRepository) {}

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
      const deletedUser = await this.userRepository.findOneAndDelete({ _id });

      return {};
    } catch (err) {
      throw new Error(err);
    }
  }
}
