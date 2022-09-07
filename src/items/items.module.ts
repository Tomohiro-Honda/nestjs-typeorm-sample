import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { itemProviders } from './item.providers';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ItemsController],
  providers: [ItemsService, ...itemProviders],
})
export class ItemsModule {}
