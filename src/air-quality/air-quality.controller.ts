import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AirQualityService } from './air-quality.service';
import { AirQualityQueryDto, CityQueryDto } from './air-quality.dto';
import { IAirQualityResponse } from './air-quality.interface';
import { IAirQualityRecord } from './air-quality.entity';
import {
  MostPollutedResponseDto,
  PollutionResponseDto,
} from './responses/get-air-quality-response.dto';
import {
  BadRequestResponseDto,
  UnauthorizedResponseDto,
} from './responses/common-response.dto';

@Controller('air-quality')
@ApiTags('air-quality')
@ApiResponse({
  status: HttpStatus.BAD_REQUEST,
  description: 'Bad Request',
  type: BadRequestResponseDto,
})
@ApiResponse({
  status: HttpStatus.UNAUTHORIZED,
  description: 'Unauthorized',
  type: UnauthorizedResponseDto,
})
export class AirQualityController {
  constructor(private readonly airQualityService: AirQualityService) {}

  @Get()
  @ApiOperation({ summary: 'get air quality for a given zone' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: PollutionResponseDto,
  })
  getAirQuality(
    @Query() airQualityQueryDto: AirQualityQueryDto,
  ): Promise<IAirQualityResponse> {
    return this.airQualityService.getAQIDataForNearestCity(airQualityQueryDto);
  }

  @Get('most-polluted-time')
  @ApiOperation({ summary: 'get most polluted ZoneTime' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: MostPollutedResponseDto,
  })
  getMostPollutedZoneTime(
    @Query() airQualityQueryDto: CityQueryDto,
  ): Promise<IAirQualityRecord | object> {
    return this.airQualityService.getMostPollutedZoneTime(airQualityQueryDto);
  }
}
