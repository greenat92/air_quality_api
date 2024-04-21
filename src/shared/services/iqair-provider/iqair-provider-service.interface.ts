import { AirQualityQueryDto } from '../../../air-quality/air-quality.dto';

export interface IiqirProviderService {
  getAirQualityDataFromIQAirProvider(
    airQualityQueryDto: AirQualityQueryDto,
  ): Promise<any>;
}

// the following allows us to inject the interface directly by symbol, instead of using a string token
export const IiqirProviderService = Symbol('IiqirProviderService');
