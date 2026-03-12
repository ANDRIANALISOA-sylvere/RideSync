import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { LocationService } from './location.service';
import { UpdateLocationDto } from './dto/update-location.dto';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post('update')
  async updateLocation(@Body() dto: UpdateLocationDto) {
    await this.locationService.updateLocation(dto);

    return { message: 'Location updated' };
  }

  @Get('drivers/nearby')
  async getNearbyDrivers(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
    @Query('radius') radius: string,
  ) {
    const drivers = await this.locationService.getNearbyDrivers(
      parseFloat(lat),
      parseFloat(lng),
      radius && parseFloat(radius),
    );

    return drivers;
  }
}
