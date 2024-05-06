/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { AirQualityService } from './air-quality.service';
import { getModelToken } from '@nestjs/mongoose';
import { HttpException, HttpStatus } from '@nestjs/common';
import {
  AirQualityRecord,
  AirQualityRecordDocument,
} from './air-quality.entity';
import { getAirQualityLevel } from '../shared/helpers/air-quality-level.helper';
import { Model } from 'mongoose';
import { IiqirProviderService } from '../shared/services/iqair-provider/iqair-provider-service.interface';
import { IReverseGeocodingService } from '../shared/services/reverse-geocoding/reverse-geocoding-service.interface';
import { CacheService } from '../shared/services/cache/cache.service';

jest.mock('../shared/helpers/air-quality-level.helper');
jest.mock('../shared/services/iqair-provider/iqair-provider.service');

describe('AirQualityService', () => {
  let service: AirQualityService;
  let airQualityRecordModel: Model<AirQualityRecordDocument>;
  let iqAirProviderService: IiqirProviderService;
  let reverseGeocodingService: IReverseGeocodingService;
  let cacheService: CacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AirQualityService,
        {
          provide: getModelToken(AirQualityRecord.name),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: IiqirProviderService,
          useValue: {
            getAirQualityDataFromIQAirProvider: jest.fn().mockResolvedValue({
              data: {
                data: {
                  current: {
                    pollution: {
                      ts: new Date(),
                      aqius: 15,
                      mainus: 'p1',
                      aqicn: 10,
                      maincn: 'p1',
                    },
                  },
                },
              },
            }),
          },
        },
        {
          provide: IReverseGeocodingService,
          useValue: {
            reverse: jest.fn().mockResolvedValue({
              city: 'City',
              state: 'Satate',
              country: 'Country',
            }),
          },
        },
        {
          provide: CacheService,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            generateCacheKey: jest.fn().mockReturnValue('mockCacheKey'),
          },
        },
      ],
    }).compile();

    service = module.get<AirQualityService>(AirQualityService);
    airQualityRecordModel = module.get<Model<AirQualityRecordDocument>>(
      getModelToken(AirQualityRecord.name),
    );
    iqAirProviderService =
      module.get<IiqirProviderService>(IiqirProviderService);
    reverseGeocodingService = module.get<IReverseGeocodingService>(
      IReverseGeocodingService,
    );
    cacheService = module.get<CacheService>(CacheService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAQIDataForNearestCity', () => {
    it('[UNIT] should return air quality data', async () => {
      const mockResponse = {
        pollution: {
          aqius: 15,
          mainus: 'p1',
          aqicn: 10,
          maincn: 'p1',
        },
      };
      const result = await service.getAQIDataForNearestCity(
        {
          lat: 40.7128,
          lon: -74.006,
        },
        // avoiding using cache
        false,
      );
      console.log(JSON.stringify(result));
      expect(result.result.pollution).toEqual(
        expect.objectContaining(mockResponse.pollution),
      );
      expect(result.result.pollution.ts).toBeInstanceOf(Date);
    });

    it('[UNIT] should handle error and throw HttpException', async () => {
      try {
        await service.getAQIDataForNearestCity({ lat: 40.7128, lon: -74.006 });
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });
  });

  describe('getMostPollutedZoneTime', () => {
    it('[UNIT] should return most polluted zone time', async () => {
      const mockResponse = [
        {
          aqius: 36,
          ts: new Date(),
          city: 'Paris',
          location: {},
          mainus: 'p1',
        },
      ];

      (airQualityRecordModel.find as jest.Mock).mockReturnValue({
        where: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue(mockResponse),
            }),
          }),
        }),
      });

      const result = await service.getMostPollutedZoneTime({
        city: 'Paris',
      });
      expect(result).toEqual({
        result: {
          airQualityLevel: getAirQualityLevel(mockResponse[0].aqius),
          ts: mockResponse[0].ts,
          aqius: mockResponse[0].aqius,
          mainus: mockResponse[0].mainus,
          city: mockResponse[0].city,
          location: mockResponse[0].location,
        },
      });
    });

    it('[UNIT] should handle error and throw HttpException', async () => {
      (airQualityRecordModel.find as jest.Mock).mockReturnValue({
        where: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              exec: jest.fn().mockRejectedValue(new Error()),
            }),
          }),
        }),
      });

      try {
        await service.getMostPollutedZoneTime({ city: 'New York' });
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });
  });
});
