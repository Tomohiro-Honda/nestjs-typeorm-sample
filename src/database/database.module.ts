import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { dbconfig } from './database.config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...dbconfig,
    } as unknown as TypeOrmModuleOptions),
  ],
})
export class DatabaseModule {}
