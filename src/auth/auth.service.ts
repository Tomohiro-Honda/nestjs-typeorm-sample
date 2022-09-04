import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { createUser, getAllUsers } from './user.repository';

@Injectable()
export class AuthService {
  async signUp(createUserDto: CreateUserDto): Promise<User> {
    return await createUser(createUserDto);
  }

  async findAll(): Promise<User[]> {
    return await getAllUsers();
  }
}
