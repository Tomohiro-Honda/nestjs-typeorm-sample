import { DataSource, DataSourceOptions } from 'typeorm';
import { dbconfig } from './database.config';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource(
        dbconfig as unknown as DataSourceOptions,
      );

      return dataSource.initialize();
    },
  },
];
