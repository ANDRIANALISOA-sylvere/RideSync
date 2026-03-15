import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { RideEntity } from 'src/ride/ride.entity';
require('dotenv').config();

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.RIDE_DB_HOST ?? 'localhost',
  port: Number(process.env.RIDE_DB_PORT) ?? 5432,
  username: process.env.RIDE_DB_USER ?? 'postgres',
  password: process.env.RIDE_DB_PASSWORD ?? 'postgres',
  database: process.env.RIDE_DB_NAME ?? 'ride_db',
  entities: [RideEntity],
  synchronize: true,
};
