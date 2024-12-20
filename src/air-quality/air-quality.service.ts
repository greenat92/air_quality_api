import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AirQualityRecord,
  AirQualityRecordDocument,
} from './air-quality.entity';
import { AirQualityQueryDto, CityQueryDto } from './air-quality.dto';
import {
  IAirQuality,
  IAirQualityResponse,
  IMostPollutedTime,
} from './air-quality.interface';
import { CustomLogger } from '../shared/custom-logger/custom-logger.service';
import { IiqirProviderService } from '../shared/services/iqair-provider/iqair-provider-service.interface';
import { CacheService } from '../shared/services/cache/cache.service';
import { IReverseGeocodingService } from '../shared/services/reverse-geocoding/reverse-geocoding-service.interface';
import { IReverseGeocodingResponse } from '../shared/services/reverse-geocoding/reverse-geocoding-response.interface';

@Injectable()
export class AirQualityService {
  constructor(
    @InjectModel(AirQualityRecord.name)
    private readonly airQualityRecordModel: Model<AirQualityRecordDocument>,
    @Inject(IiqirProviderService)
    private readonly _IQAirProviderService: IiqirProviderService,
    @Inject(IReverseGeocodingService)
    private readonly _reverseGeocodingService: IReverseGeocodingService,
    private readonly _cacheService: CacheService,
  ) {}

  async findOneByTsAndCity(
    ts: Date,
    city: string,
  ): Promise<AirQualityRecordDocument | null> {
    const logger = new CustomLogger(
      AirQualityService.name,
      this.findOneByTsAndCity.name,
    );
    try {
      const record = await this.airQualityRecordModel
        .findOne({
          ts,
          city: {
            $eq: city,
          },
        })
        .exec();

      logger.log('success');
      return record;
    } catch (error) {
      logger.error(error);
      throw new InternalServerErrorException(
        `Something wrong happen in the server`,
      );
    }
  }

  async saveAirQualityRecord(
    airQualityData: IAirQuality,
  ): Promise<AirQualityRecordDocument> {
    const logger = new CustomLogger(
      AirQualityService.name,
      this.saveAirQualityRecord.name,
    );
    // check if the record is exist in database before adding
    const existingRecord = await this.findOneByTsAndCity(
      airQualityData.ts,
      airQualityData.city,
    );

    if (!existingRecord) {
      let airQualityRecord = new this.airQualityRecordModel(airQualityData);
      airQualityRecord = await airQualityRecord.save();
      logger.log('new record saved success');
      return airQualityRecord;
    }
    logger.log('no new record saved');
    return existingRecord;
  }

  async getAQIDataForNearestCity(
    airQualityQueryDto: AirQualityQueryDto,
    useCache: boolean = true,
  ): Promise<IAirQualityResponse> {
    const logger = new CustomLogger(
      AirQualityService.name,
      this.getAQIDataForNearestCity.name,
    );
    try {
      // reveser geocode
      const reverseGeocodingRes: IReverseGeocodingResponse =
        await this._reverseGeocodingService.reverse(airQualityQueryDto);

      // check if the data in the cache
      if (
        useCache &&
        this._cacheService.get(
          this._cacheService.generateCacheKey(reverseGeocodingRes.city),
        )
      ) {
        logger.log('get data from the cache');
        return {
          result: {
            pollution: this._cacheService.get(
              this._cacheService.generateCacheKey(reverseGeocodingRes.city),
            ),
          },
        };
      }

      // get data from the api
      const res =
        await this._IQAirProviderService.getAirQualityDataFromIQAirProvider(
          airQualityQueryDto,
        );
      logger.log('get data from the api');
      const pollution = res.data?.data?.current?.pollution;
      // set cache
      this._cacheService.set(
        this._cacheService.generateCacheKey(reverseGeocodingRes.city),
        pollution,
      );
      logger.log('success');
      return { result: { pollution } };
    } catch (error) {
      if (error instanceof HttpException) {
        // forward HttpException
        logger.error(error);
        throw new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        logger.error(error);
        throw new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async getMostPollutedZoneTime(
    cityQueryDto: CityQueryDto,
  ): Promise<AirQualityRecordDocument | object> {
    const logger = new CustomLogger(
      AirQualityService.name,
      this.getMostPollutedZoneTime.name,
    );
    try {
      // based on a city Name that already stored in our database we can  get the time where is the most polluted
      // const pollutedZoneTime: AirQualityRecordDocument[] =
      //   await this.airQualityRecordModel
      //     .find()
      //     .where({
      //       city: {
      //         $eq: cityQueryDto.city,
      //       },
      //     })
      //     .sort({ aqius: -1, ts: -1 })
      //     .limit(1)
      //     .exec();

      // another promising query using aggregation
      const pollutedZoneTime: IMostPollutedTime[] =
        await this.airQualityRecordModel.aggregate([
          // Match records for Paris city
          {
            $match: {
              city: {
                $eq: cityQueryDto.city,
              },
            },
          },
          // Group by timestamp and find the maximum pollution level
          {
            $group: {
              _id: '$ts',
              maxPollution: { $max: '$aqius' }, // Assuming you want to find the maximum AQI for simplicity
            },
          },
          // Sort by pollution level in descending order
          { $sort: { maxPollution: -1 } },
          // Limit to one result to get the most polluted time
          { $limit: 1 },
        ]);
      const res =
        pollutedZoneTime && pollutedZoneTime.length > 0
          ? {
              maxPollution: pollutedZoneTime[0].maxPollution,
              ts: pollutedZoneTime[0]._id,
            }
          : {
              // default response
              maxPollution: -1,
              ts: '-',
            };
      logger.log('success');
      return {
        result: {
          ts: res.ts!,
          maxPollution: res?.maxPollution,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        logger.error(`Specific error occurred: ${error.message}`);
        throw new HttpException(
          'Specific error message',
          HttpStatus.BAD_REQUEST,
        );
      } else {
        logger.error(`Unexpected error occurred: ${error.message}`);
        throw new HttpException(
          'An error occurred while processing your request',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  /*
  this is used for the cron job and if we go with a cron job of every 
  minute so it's needed to use a cache while we have the city name and ts time
  */
  async getAQIDataForNearestCityForCronJob(
    airQualityQueryDto: AirQualityQueryDto,
  ): Promise<any> {
    const logger = new CustomLogger(
      AirQualityService.name,
      this.getAQIDataForNearestCity.name,
    );
    try {
      const res =
        await this._IQAirProviderService.getAirQualityDataFromIQAirProvider(
          airQualityQueryDto,
        );
      logger.log('success');
      return res.data;
    } catch (error) {
      if (error instanceof HttpException) {
        // forward HttpException
        logger.error(error);
        throw new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        logger.error(error);
        throw new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
