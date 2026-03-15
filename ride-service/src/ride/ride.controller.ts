import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { RideService } from './ride.service';
import { RequestRideDto } from './dto/request-ride.dto';

@Controller('rides')
export class RideController {
  constructor(private readonly rideService: RideService) {}

  @Post('request')
  async requestRide(@Body() dto: RequestRideDto) {
    return this.rideService.requestRide(dto);
  }

  @Post(':id/accept')
  async acceptRide(
    @Param('id') id: string,
    @Body('driverId') driverId: string,
  ) {
    return this.rideService.acceptRide(id, driverId);
  }

  @Post(':id/complete')
  async completeRide(@Param('id') id: string) {
    return this.rideService.completeRide(id);
  }

  @Post(':id/cancel')
  async cancelRide(@Param('id') id: string) {
    return this.rideService.cancelRide(id);
  }

  @Get(':id')
  async getRide(@Param('id') id: string) {
    return this.rideService.getRide(id);
  }

  @Get()
  async getHistory(@Query('riderId') riderId: string) {
    return this.rideService.getRideHistory(riderId);
  }
}
