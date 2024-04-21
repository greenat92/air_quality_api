import { ApiProperty } from '@nestjs/swagger';
import { IsLatitude, IsLongitude, IsString } from 'class-validator';

export interface ILocationQueryDto {
  lat: number;
  lon: number;
}

export class AirQualityQueryDto implements ILocationQueryDto {
  @ApiProperty({
    description: 'Latitude should be within range [-90, 90]',
    default: 48.856613,
  })
  @IsLatitude({
    message: 'Invalid coordinates. Latitude should be within range [-90, 90].',
  })
  lat: number;

  @ApiProperty({
    description: 'Longitude should be within range [-180, 180].',
    default: 2.352222,
  })
  @IsLongitude({
    message:
      'Invalid coordinates. Longitude should be within range [-180, 180].',
  })
  lon: number;
}

export interface ICityQueryDto {
  city: string;
}

export class CityQueryDto implements ICityQueryDto {
  @ApiProperty({
    description: 'city name',
    default: 'Paris',
  })
  @IsString({
    message: 'city name is required',
  })
  city: string;
}
