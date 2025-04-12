import { Injectable } from '@nestjs/common';
import { UsersRepository } from './repository/users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository) {}

  createUser(createUserDto: CreateUserDto) {
    return this.userRepository.create(createUserDto);
  }

  getUser(_id: string) {
    return this.userRepository.findOne({ _id });
  }

  updateUser(updateUserDto: UpdateUserDto, _id: string) {
    return this.userRepository.findOneAndUpdate(
      { _id },
      { $set: updateUserDto },
    );
  }

  deleteUser(_id: string) {
    return this.userRepository.findOneAndDelete({ _id });
  }
}
