import { Module } from '@nestjs/common';
import { ItemsModule } from './items/items.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [DatabaseModule, ItemsModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
