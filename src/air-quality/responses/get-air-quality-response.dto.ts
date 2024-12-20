import { ApiProperty } from '@nestjs/swagger';

export class PollutionResponseDto {
  @ApiProperty({
    example: '2024-04-18T16:00:00.000Z',
    description: 'Timestamp',
  })
  ts: string;

  @ApiProperty({
    example: 114,
    description: 'AQI (Air Quality Index) in the US',
  })
  aqius: number;

  @ApiProperty({ example: 'p2', description: 'Main pollutant in the US' })
  mainus: string;

  @ApiProperty({ example: 58, description: 'AQI (Air Quality Index) in China' })
  aqicn: number;

  @ApiProperty({ example: 'p2', description: 'Main pollutant in China' })
  maincn: string;
}

export class MostPollutedResponseDto {
  @ApiProperty({
    example: '2024-04-18T16:00:00.000Z',
    description: 'Timestamp',
  })
  ts: string;

  @ApiProperty({
    example: 114,
    description: 'AQI (Air Quality Index) in the US',
  })
  maxPollution: number;
}
