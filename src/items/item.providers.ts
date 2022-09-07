import { Item } from '../entities/item.entity';
import { DataSource } from 'typeorm';

export const itemProviders = [
  {
    provide: 'ITEM_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Item),
    inject: ['DATA_SOURCE'],
  },
];
