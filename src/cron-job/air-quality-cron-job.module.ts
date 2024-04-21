import { Module } from '@nestjs/common';
import { AirQualityCronJobService } from './air-quality-cron-job.service';
import { AirQualityModule } from '../air-quality/air-quality.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot(), AirQualityModule],
  providers: [AirQualityCronJobService],
})
export class AirQualityJobModule {}
