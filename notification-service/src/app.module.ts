import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotificationController } from './notification/notification.controller';
import { NotificationService } from './notification/notification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { NotificationEntity } from './notification/notification.entity';
import { NotificationGateway } from './notification/notification.gateway';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature([NotificationEntity]),
  ],
  controllers: [AppController, NotificationController],
  providers: [AppService, NotificationService, NotificationGateway],
})
export class AppModule {}
