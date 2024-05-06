import { Injectable } from '@nestjs/common';

import { AirQualityQueryDto } from '../../../air-quality/air-quality.dto';
import { CustomLogger } from '../../../shared/custom-logger/custom-logger.service';
import { IiqirProviderService } from './iqair-provider-service.interface';

const data = {
  status: 'success',
  data: {
    city: 'Paris',
    state: 'Ile-de-France',
    country: 'France',
    location: {
      type: 'Point',
      coordinates: [2.351666, 48.859425],
    },
    current: {
      pollution: {
        ts: '2024-04-20T10:00:00.000Z',
        aqius: 30,
        mainus: 'o3',
        aqicn: 23,
        maincn: 'o3',
      },
      weather: {
        ts: '2024-04-20T10:00:00.000Z',
        tp: 9,
        pr: 1026,
        hu: 62,
        ws: 5.14,
        wd: 350,
        ic: '04d',
      },
    },
  },
};

@Injectable()
export class IQAirProviderMockService implements IiqirProviderService {
  async getAirQualityDataFromIQAirProvider(
    airQualityQueryDto: AirQualityQueryDto,
  ): Promise<any> {
    const logger = new CustomLogger(
      IQAirProviderMockService.name,
      this.getAirQualityDataFromIQAirProvider.name,
    );
    logger.log(`calling the mocked IQAir Provider ${airQualityQueryDto}`);
    return { data: { data } };
  }
}
