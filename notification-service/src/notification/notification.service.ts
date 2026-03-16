import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationEntity } from './notification.entity';
import { Repository } from 'typeorm';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepo: Repository<NotificationEntity>,
    private readonly gateway: NotificationGateway,
  ) {}

  async handleRideMatched(payload: any) {
    console.log('ride.matched received:', payload);

    await this.notificationRepo.save({
      userId: payload.driverId,
      type: 'ride.matched',
      payload,
    });

    this.gateway.sendToUser(payload.driverId, 'ride:matched', {
      rideId: payload.rideId,
      pickupLat: payload.pickupLat,
      pickupLng: payload.pickupLng,
      message: 'New ride request!',
    });
  }

  async handleRideAccepted(payload: any) {
    console.log('ride.accepted received:', payload);

    await this.notificationRepo.save({
      userId: payload.riderId,
      type: 'ride.accepted',
      payload,
    });

    this.gateway.sendToUser(payload.riderId, 'ride:accepted', {
      rideId: payload.rideId,
      driverId: payload.driverId,
      message: 'Driver accepted your ride!',
    });
  }

  async handleRideCompleted(payload: any) {
    console.log('ride.completed received:', payload);

    await this.notificationRepo.save({
      userId: payload.riderId,
      type: 'ride.completed',
      payload,
    });

    this.gateway.sendToUser(payload.riderId, 'ride:completed', {
      rideId: payload.rideId,
      message: 'Ride completed!',
    });

    this.gateway.sendToUser(payload.driverId, 'ride:completed', {
      rideId: payload.rideId,
      message: 'Ride completed!',
    });
  }

  async handleRideCancelled(payload: any) {
    console.log('ride.cancelled received:', payload);

    await this.notificationRepo.save({
      userId: payload.riderId,
      type: 'ride.cancelled',
      payload,
    });

    this.gateway.sendToUser(payload.riderId, 'ride:cancelled', {
      rideId: payload.rideId,
      message: 'Ride cancelled.',
    });
  }

  async getNotifications(userId: string): Promise<NotificationEntity[]> {
    return this.notificationRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }
}
