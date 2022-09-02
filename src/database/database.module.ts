import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { getDbConfig } from './database.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: getDbConfig as unknown as (
        ...args: any[]
      ) => TypeOrmModuleOptions | Promise<TypeOrmModuleOptions>,
    }),
  ],
})
export class DatabaseModule {}
