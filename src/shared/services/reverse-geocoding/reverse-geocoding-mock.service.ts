import { Injectable } from '@nestjs/common';
import { CustomLogger } from '@shared/custom-logger/custom-logger.service';
import { ILocationQueryDto } from '../../../air-quality/air-quality.dto';
import { IReverseGeocodingService } from './reverse-geocoding-service.interface';
import { IReverseGeocodingResponse } from './reverse-geocoding-response.interface';

const data: IReverseGeocodingResponse = {
  city: ' Paris',
  state: 'Paris',
  country: 'France',
};

@Injectable()
export class ReverseGeocodingMockService implements IReverseGeocodingService {
  async reverse(
    location: ILocationQueryDto,
  ): Promise<IReverseGeocodingResponse> {
    const logger = new CustomLogger(
      ReverseGeocodingMockService.name,
      this.reverse.name,
    );
    logger.log(`calling the mocked ReverseGeocodingMockService ${location}`);
    return data;
  }
}
