import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import * as nominatim from 'nominatim-client';
import { ILocationQueryDto } from '../../../air-quality/air-quality.dto';
import { IReverseGeocodingService } from './reverse-geocoding-service.interface';
import { IReverseGeocodingResponse } from './reverse-geocoding-response.interface';
import { CustomLogger } from '../../custom-logger/custom-logger.service';

@Injectable()
export class ReverseGeocodingService implements IReverseGeocodingService {
  private _nominatim = nominatim.createClient({
    useragent: process.env.APP_NAME || 'AirQuality', // The name of your application
    referer: `http://${process.env.HOST}:${process.env.PORT}`, // The referer link
  });
  constructor() {}

  async reverse(
    location: ILocationQueryDto,
  ): Promise<IReverseGeocodingResponse> {
    const logger = new CustomLogger(
      ReverseGeocodingService.name,
      this.reverse.name,
    );
    try {
      const res: nominatim.ReverseResult =
        await this._nominatim.reverse(location);
      logger.log('success');
      return {
        city: res.address.city, // todo: sometimes we get village instead of city(add fallback to village if city is undefined)
        state: res.address.state,
        country: res.address.country,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        // forward HttpException
        throw error;
      } else {
        logger.error(error);
        throw new HttpException(
          'internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
