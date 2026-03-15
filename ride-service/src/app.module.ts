import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RideController } from './ride/ride.controller';
import { RideService } from './ride/ride.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { RideEntity } from './ride/ride.entity';

@Module({
  imports: [TypeOrmModule.forRoot(databaseConfig), TypeOrmModule.forFeature([RideEntity])],
  controllers: [AppController, RideController],
  providers: [AppService, RideService],
})
export class AppModule {}
