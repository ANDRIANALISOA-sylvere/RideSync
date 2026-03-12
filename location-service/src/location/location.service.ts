import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Redis from 'ioredis';
import { LocationEntity } from './location.entity';
import { Repository } from 'typeorm';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class LocationService {
  private redis: Redis;

  constructor(
    @InjectRepository(LocationEntity)
    private readonly LocationRepo: Repository<LocationEntity>,
  ) {
    this.redis = new Redis({
      host: process.env.REDIS_HOST ?? 'localhost',
      port: Number(process.env.REDIS_PORT) ?? 6379,
    });
  }

  async updateLocation(dto: UpdateLocationDto): Promise<void> {
    const location = this.LocationRepo.create(dto);
    await this.LocationRepo.save(location);

    await this.redis.geoadd(
      'drivers',
      dto.longitude,
      dto.latitude,
      dto.driverId,
    );

    console.log(`Driver ${dto.driverId} position updated`);
  }

  async getNearbyDrivers(
    latitude: number,
    longitude: number,
    radiusKm: number = 3,
  ) {
    const drivers = await this.redis.geosearch(
      'drivers',
      'FROMLONLAT',
      longitude,
      latitude,
      'BYRADIUS',
      radiusKm,
      'km',
      'ASC',
    );

    return drivers as string[];
  }
}
