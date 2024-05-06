import { Test, TestingModule } from '@nestjs/testing';
import { AirQualityController } from './air-quality.controller';
import { AirQualityService } from './air-quality.service';
import { HttpStatus } from '@nestjs/common';

jest.mock('./air-quality.service');

describe('[UNIT] AirQualityController', () => {
  let controller: AirQualityController;
  let airQualityService: AirQualityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AirQualityController],
      providers: [AirQualityService],
    }).compile();

    controller = module.get<AirQualityController>(AirQualityController);
    airQualityService = module.get<AirQualityService>(AirQualityService);
  });

  it('[UNIT] should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAirQuality', () => {
    it('[UNIT] should return air quality data for nearest city', async () => {
      const mockAirQualityData = {
        result: {
          pollution: {
            ts: new Date(), // Ensure ts property is a Date object
            aqius: 15,
            mainus: 'p1',
            aqicn: 10,
            maincn: 'p1',
          },
        },
      };
      jest
        .spyOn(airQualityService, 'getAQIDataForNearestCity')
        .mockResolvedValue(mockAirQualityData);

      const result = await controller.getAirQuality({
        lat: 40.7128,
        lon: -74.006,
      });

      expect(result).toEqual(mockAirQualityData);
    });

    it('[UNIT] should handle error and return Unauthorized', async () => {
      jest
        .spyOn(airQualityService, 'getAQIDataForNearestCity')
        .mockRejectedValue({ response: { status: HttpStatus.UNAUTHORIZED } });

      try {
        await controller.getAirQuality({ lat: 40.7128, lon: -74.006 });
      } catch (error) {
        expect(error.response.status).toBe(HttpStatus.UNAUTHORIZED);
      }
    });
  });

  describe('getMostPollutedZoneTime', () => {
    it('[UNIT] should return most polluted zone time for a city', async () => {
      const mockPollutionTime = {
        result: {
          airQualityLevel: 'Good',
          ts: '2024-04-30T05:00:00.000Z',
          aqius: 50,
          mainus: 'o3',
          city: 'Paris',
          location: {
            type: 'Point',
            coordinates: [2.351666, 48.859425],
          },
        },
      };
      jest
        .spyOn(airQualityService, 'getMostPollutedZoneTime')
        .mockResolvedValue(mockPollutionTime);

      const result = await controller.getMostPollutedZoneTime({
        city: 'Paris',
      });
      expect(result).toEqual(mockPollutionTime);
    });

    it('[UNIT] should handle error and return Unauthorized', async () => {
      jest
        .spyOn(airQualityService, 'getMostPollutedZoneTime')
        .mockRejectedValue({ response: { status: HttpStatus.UNAUTHORIZED } });

      try {
        await controller.getMostPollutedZoneTime({ city: 'New York' });
      } catch (error) {
        expect(error.response.status).toBe(HttpStatus.UNAUTHORIZED);
      }
    });
  });
});
