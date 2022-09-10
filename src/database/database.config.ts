import * as dotenv from 'dotenv';

dotenv.config();

export const dbconfig = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD as string,
  database: process.env.POSTGRES_DB,
  entities: ['dist/entities/*.js'],
};
