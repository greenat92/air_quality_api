import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ILocationQueryDto } from '../air-quality/air-quality.dto';
import { AirQualityService } from '../air-quality/air-quality.service';
import { CustomLogger } from '../shared/custom-logger/custom-logger.service';

@Injectable()
export class AirQualityCronJobService {
  constructor(private _airQualityService: AirQualityService) {}

  startTime = new Date().getTime();
  @Cron(process.env.CRON_EXPRESSION || CronExpression.EVERY_HOUR, {
    name: 'getAirQualityCronJob',
  })
  async getAirQualityCronJob() {
    const logger = new CustomLogger(
      AirQualityCronJobService.name,
      this.getAirQualityCronJob.name,
    );
    logger.log('get air quality for paris and save it into database');
    const parisLocation: ILocationQueryDto = {
      lat: Number(process.env.PARIS_LAT),
      lon: Number(process.env.PARIS_LON),
    };

    const res: any =
      await this._airQualityService.getAQIDataForNearestCityForCronJob(
        parisLocation,
      );

    // save it to database
    const objectToBeSaved = {
      ...res.data?.current?.pollution,
      location: res.data?.location,
      city: res.data?.city,
      state: res.data?.state,
      country: res.data?.country,
    };
    await this._airQualityService.saveAirQualityRecord(objectToBeSaved);
  }
}
