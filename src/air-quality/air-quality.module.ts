import { Module } from '@nestjs/common';
import { AirQualityController } from './air-quality.controller';
import { AirQualityService } from './air-quality.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AirQualityRecord, AirQualityRecordSchema } from './air-quality.entity';
import { CacheModule } from '../shared/services/cache/cache.module';
import { IQAirProviderModule } from 'src/shared/services/iqair-provider/iqair-provider.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AirQualityRecord.name, schema: AirQualityRecordSchema },
    ]),
    IQAirProviderModule,
    CacheModule,
  ],
  controllers: [AirQualityController],
  providers: [AirQualityService],
  exports: [AirQualityService],
})
export class AirQualityModule {}
