import { JwtModuleOptions } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { Algorithm } from 'jsonwebtoken';
import * as path from 'path';
import * as fs from 'fs';

dotenv.config();
const secretkey = path.join(__dirname, '../', process.env.SECRET_KEY);
const publickey = path.join(__dirname, '../', process.env.PUBLIC_KEY);
const JWT_SECRET = fs.readFileSync(secretkey);
const PUBLIC_KEY = fs.readFileSync(publickey);

export const config: JwtModuleOptions = {
  privateKey: JWT_SECRET,
  publicKey: PUBLIC_KEY,
  signOptions: {
    expiresIn: process.env.EXPIRES,
    algorithm: process.env.ALGORITHM as unknown as Algorithm,
  },
};
