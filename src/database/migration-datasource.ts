import { DataSource, DataSourceOptions } from 'typeorm';
import { dbconfig } from './database.config';

const migrationDataSource = new DataSource({
  ...dbconfig,
  synchronize: true,
  migrations: ['src/migration/**/*.ts'],
} as unknown as DataSourceOptions);

export default migrationDataSource;
