import { Controller, Get, Param } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @EventPattern('ride.matched')
  async onRideMatched(@Payload() payload: any) {
    await this.notificationService.handleRideMatched(payload);
  }

  @EventPattern('ride.accepted')
  async onRideAccepted(@Payload() payload: any) {
    await this.notificationService.handleRideAccepted(payload);
  }

  @EventPattern('ride.completed')
  async onRideCompleted(@Payload() payload: any) {
    await this.notificationService.handleRideCompleted(payload);
  }

  @EventPattern('ride.cancelled')
  async onRideCancelled(@Payload() payload: any) {
    await this.notificationService.handleRideCancelled(payload);
  }

  @Get(':userId')
  async getNotifications(@Param('userId') userId: string) {
    return this.notificationService.getNotifications(userId);
  }
}
