import { IsNumber, IsString } from 'class-validator';

export class UpdateLocationDto {
  @IsString()
  driverId: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;
}
