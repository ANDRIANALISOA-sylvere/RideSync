import { IsNumber, IsString } from 'class-validator';

export class RequestRideDto {
  @IsString()
  riderId: string;

  @IsNumber()
  pickupLat: number;

  @IsNumber()
  pickupLng: number;

  @IsNumber()
  dropoffLat: number;

  @IsNumber()
  dropoffLng: number;

  @IsNumber()
  radius: number;
}
