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
    it('[UNIT] should handle error and return Bad Request', async () => {
      jest
        .spyOn(airQualityService, 'getAQIDataForNearestCity')
        .mockRejectedValue({ response: { status: HttpStatus.BAD_REQUEST } });

      try {
        await controller.getAirQuality({ lat: 40.7128, lon: -74.006 });
      } catch (error) {
        expect(error.response.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });
  });

  describe('getMostPollutedZoneTime', () => {
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
