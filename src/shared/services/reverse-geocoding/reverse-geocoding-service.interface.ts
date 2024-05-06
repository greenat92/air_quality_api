import { ILocationQueryDto } from '../../../air-quality/air-quality.dto';
import { IReverseGeocodingResponse } from './reverse-geocoding-response.interface';

export interface IReverseGeocodingService {
  reverse(location: ILocationQueryDto): Promise<IReverseGeocodingResponse>;
}

// the following allows us to inject the interface directly by symbol, instead of using a string token
export const IReverseGeocodingService = Symbol('IReverseGeocodingService');
