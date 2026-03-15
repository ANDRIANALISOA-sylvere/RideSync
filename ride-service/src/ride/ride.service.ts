import { InjectRepository } from '@nestjs/typeorm';
import { RideEntity, RideStatus } from './ride.entity';
import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { RequestRideDto } from './dto/request-ride.dto';
import axios from 'axios';

@Injectable()
export class RideService {
  private rabbitClient: ClientProxy;
  constructor(
    @InjectRepository(RideEntity)
    private readonly rideRepository: Repository<RideEntity>,
  ) {
    this.rabbitClient = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL ?? 'amqp://guest:guest@localhost:5672'],
        queue: 'ridesync_queue',
        queueOptions: { durable: true },
      },
    });
  }

  async requestRide(dto: RequestRideDto): Promise<RideEntity> {
    const ride = this.rideRepository.create({
      ...dto,
      status: RideStatus.SEARCHING,
    });
    await this.rideRepository.save(ride);

    const locationServiceUrl =
      process.env.LOCATION_SERVICE_URL ?? 'http://location-service:3001';

    try {
      const response = await axios.get(
        `${locationServiceUrl}/location/drivers/nearby`,
        {
          params: {
            lat: dto.pickupLat,
            lng: dto.pickupLng,
            radius: dto.radius ?? 3,
          },
        },
      );

      const drivers: string[] = response.data;

      if (drivers.length === 0) {
        ride.status = RideStatus.CANCELLED;
        await this.rideRepository.save(ride);
        return ride;
      }

      const nearestDriver = drivers[0];
      ride.driverId = nearestDriver;
      ride.status = RideStatus.MATCHED;
      await this.rideRepository.save(ride);

      this.rabbitClient.emit('ride.matched', {
        rideId: ride.id,
        driverId: nearestDriver,
        riderId: ride.riderId,
        pickupLat: dto.pickupLat,
        pickupLng: dto.pickupLng,
      });

      console.log(`Ride ${ride.id} matched with driver ${nearestDriver}`);

      return ride;
    } catch (error: any) {
      console.error('Error contacting location service:', error.message);
    }
  }

  async acceptRide(rideId: string, driverId: string): Promise<RideEntity> {
    const ride = await this.rideRepository.findOne({
      where: {
        id: rideId,
      },
    });
    if (!ride) throw new NotFoundException('Ride not found');

    ride.status = RideStatus.ACCEPTED;
    await this.rideRepository.save(ride);

    this.rabbitClient.emit('ride.accepted', {
      rideId: ride.id,
      driverId,
      riderId: ride.riderId,
    });

    return ride;
  }

  async completeRide(rideId: string): Promise<RideEntity> {
    const ride = await this.rideRepository.findOne({
      where: {
        id: rideId,
      },
    });
    if (!ride) throw new NotFoundException('Ride not found');

    ride.status = RideStatus.COMPLETED;
    await this.rideRepository.save(ride);

    this.rabbitClient.emit('ride.completed', {
      rideId: ride.id,
      driverId: ride.driverId,
      riderId: ride.riderId,
    });

    return ride;
  }

  async cancelRide(rideId: string): Promise<RideEntity> {
    const ride = await this.rideRepository.findOne({
      where: {
        id: rideId,
      },
    });

    if (!ride) throw new NotFoundException('Ride not found');

    ride.status = RideStatus.CANCELLED;
    await this.rideRepository.save(ride);

    this.rabbitClient.emit('ride.cancelled', {
      rideId: ride.id,
      driverId: ride.driverId,
      riderId: ride.riderId,
    });

    return ride;
  }

  async getRide(rideId: string): Promise<RideEntity> {
    const ride = await this.rideRepository.findOne({ where: { id: rideId } });
    if (!ride) throw new NotFoundException('Ride not found');
    return ride;
  }

  async getRideHistory(riderId: string): Promise<RideEntity[]> {
    return this.rideRepository.find({
      where: { riderId },
      order: { createdAt: 'DESC' },
    });
  }
}
