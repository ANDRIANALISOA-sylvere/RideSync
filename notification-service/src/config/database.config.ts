import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { NotificationEntity } from 'src/notification/notification.entity';
require('dotenv').config();

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.NOTIFICATION_DB_HOST ?? 'localhost',
  port: Number(process.env.NOTIFICATION_DB_PORT) ?? 5432,
  username: process.env.NOTIFICATION_DB_USER ?? 'postgres',
  password: process.env.NOTIFICATION_DB_PASSWORD ?? 'postgres',
  database: process.env.NOTIFICATION_DB_NAME ?? 'notification_db',
  entities: [NotificationEntity],
  synchronize: true,
};
