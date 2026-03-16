import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';
require('dotenv').config();

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.API_GATEWAY_DB_HOST ?? 'localhost',
  port: Number(process.env.API_GATEWAY_DB_PORT) ?? 5432,
  username: process.env.API_GATEWAY_DB_USER ?? 'postgres',
  password: process.env.API_GATEWAY_DB_PASSWORD ?? 'postgres',
  database: process.env.API_GATEWAY_DB_NAME ?? 'gateway_db',
  entities: [UserEntity],
  synchronize: true,
};
