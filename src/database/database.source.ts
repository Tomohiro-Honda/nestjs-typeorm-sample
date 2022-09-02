import { DataSource, DataSourceOptions } from 'typeorm';
import { dbconfig } from './database.config';

const AppDataSource = new DataSource({
  ...dbconfig,
  synchronize: true,
  migrations: ['src/migration/**/*.ts'],
} as unknown as DataSourceOptions);

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });

export default AppDataSource;
