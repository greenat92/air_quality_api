import { Module, Global } from '@nestjs/common';
import { ReverseGeocodingService } from './reverse-geocoding.service';

@Global()
@Module({
  providers: [ReverseGeocodingService],
  exports: [ReverseGeocodingService],
})
export class ExoApiProviderModule {}
