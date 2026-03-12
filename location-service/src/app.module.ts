import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LocationController } from './location/location.controller';
import { LocationService } from './location/location.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { LocationEntity } from './location/location.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature([LocationEntity]),
  ],
  controllers: [AppController, LocationController],
  providers: [AppService, LocationService],
})
export class AppModule {}
