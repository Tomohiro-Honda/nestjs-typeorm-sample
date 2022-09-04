import { User } from '../entities/user.entity';
import AppDataSource from '../database/database.source';
import { InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

export const createUser = async (
  createUserDto: CreateUserDto,
): Promise<User> => {
  try {
    const saveUser = await AppDataSource.getRepository(User).create(
      createUserDto,
    );
    const result = await AppDataSource.getRepository(User).save(saveUser);
    return result;
  } catch (e) {
    throw new InternalServerErrorException(e.message);
  }
};

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const users = await AppDataSource.getRepository(User).find();
    return users;
  } catch (e) {
    throw new InternalServerErrorException(e.message);
  }
};
