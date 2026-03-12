require('dotenv').config();
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { LocationEntity } from 'src/location/location.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.LOCATION_DB_HOST ?? 'localhost',
  port: Number(process.env.LOCATION_DB_PORT) ?? 5434,
  username: process.env.LOCATION_DB_USER ?? 'postgres',
  password: process.env.LOCATION_DB_PASSWORD ?? 'postgres',
  database: process.env.LOCATION_DB_NAME ?? 'location_db',
  entities: [LocationEntity],
  synchronize: true,
};
