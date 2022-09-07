import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    try {
      const salt = await bcrypt.genSalt();
      const hashPass = await bcrypt.hash(createUserDto.password, salt);
      createUserDto.password = hashPass;
      const saveUser = this.userRepository.create(createUserDto);
      const result = this.userRepository.save(saveUser);
      return result;
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  async findAll(): Promise<User[]> {
    try {
      const users = await this.userRepository.find();
      return users;
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
