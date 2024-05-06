import {
  DynamicModule,
  Module,
  NestModule,
  MiddlewareConsumer,
  Global,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CustomLoggerModule } from './shared/custom-logger/custom-logger.module';
import { AirQualityModule } from './air-quality/air-quality.module';
import { AirQualityJobModule } from './cron-job/air-quality-cron-job.module';
import { CacheModule } from './shared/services/cache/cache.module';
import { MiddlewareModule } from './middleware/middleware.module';
import { AxiosModule } from './shared/services/axios/axios.module';
import { ApiKeyMiddleware } from './middleware/api-key.middleware';
import { IQAirProviderModule } from './shared/services/iqair-provider/iqair-provider.module';
import { IQAirProviderService } from './shared/services/iqair-provider/iqair-provider.service';
import { IiqirProviderService } from './shared/services/iqair-provider/iqair-provider-service.interface';
import { ConfigModule } from '@nestjs/config';
import { ReverseGeocodingModule } from './shared/services/reverse-geocoding/reverse-geocoding.module';
import { IReverseGeocodingService } from './shared/services/reverse-geocoding/reverse-geocoding-service.interface';
import { ReverseGeocodingService } from './shared/services/reverse-geocoding/reverse-geocoding.service';

// global module -> all DI mappings specified here are available in all modules
@Global()
@Module({})
export class AppModule implements NestModule {
  static withMongoose(uri: string): DynamicModule {
    return {
      module: AppModule,
      imports: [
        // Core Modules
        CustomLoggerModule,
        ConfigModule.forRoot({
          isGlobal: true, // make ConfigModule global
          envFilePath: ['.env', `.env.${process.env.NODE_ENV}`], // load environment file based on NODE_ENV
          expandVariables: true, // expand variables in .env file
        }),

        // Feature Modules
        AirQualityModule,
        AirQualityJobModule,
        CacheModule,
        MiddlewareModule,
        AxiosModule,
        IQAirProviderModule,
        ReverseGeocodingModule,

        // Mongoose Configuration
        MongooseModule.forRoot(uri),
      ],
      controllers: [],
      providers: [
        // define DI mappings (subject to override, e.g. during testing)
        // make nestjs logger available via DI in all modules
        CustomLoggerModule,
        {
          provide: IiqirProviderService,
          useClass: IQAirProviderService,
        },
        {
          provide: IReverseGeocodingService,
          useClass: ReverseGeocodingService,
        },
      ],
      exports: [
        // make DI mappings available to all modules
        IiqirProviderService,
        IReverseGeocodingService,
      ],
    };
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApiKeyMiddleware).forRoutes('air-quality'); // Apply middleware to specific route
  }
}
