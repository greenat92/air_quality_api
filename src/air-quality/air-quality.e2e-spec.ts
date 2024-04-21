import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';

import * as request from 'supertest';
import { Test } from '@nestjs/testing';

import { HttpStatus, INestApplication } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { ICityQueryDto, ILocationQueryDto } from './air-quality.dto';
import { IQAirProviderMockService } from 'src/shared/services/iqair-provider/iqair-provider-mock.service';
import { IQAirProviderService } from 'src/shared/services/iqair-provider/iqair-provider.service';

const endpoint = '/air-quality';
const xApiKey = 'x-api-key';
const apiKey = process.env.API_KEY || '1234';
const wrongKey = 'wrongKey';
describe(`${endpoint}`, () => {
  let app: INestApplication;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        AppModule.withMongoose(
          process.env.MONGO_DB_URI_TESTING ||
            'mongodb://localhost:27017/airQualityDbTest',
        ),
      ],
    })
      .overrideProvider(IQAirProviderService)
      .useValue(IQAirProviderMockService)
      .compile();
    app = moduleRef.createNestApplication();
    await app.init();
  }, 10000);

  describe(`/GET ${endpoint}`, () => {
    const validQuery: ILocationQueryDto = {
      lat: 48.856613,
      lon: 2.352222,
    };
    const runTest = (query: ILocationQueryDto, apiKey: string) =>
      request(app.getHttpServer())
        .get(`${endpoint}`)
        .query(query)
        .set(xApiKey, apiKey);

    it(`[SMOKE] should return ${HttpStatus.OK} in success case`, async () => {
      const res = await runTest(validQuery, apiKey);
      expect(res.status).toBe(HttpStatus.OK);
    });

    it(`[SECURITY] should return ${HttpStatus.UNAUTHORIZED} in success case`, async () => {
      const res = await runTest(validQuery, wrongKey);
      expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
    });
  });

  describe(`/GET ${endpoint}/most-polluted-time`, () => {
    const validQuery: ICityQueryDto = {
      city: 'Paris',
    };
    const runTest = (query: ICityQueryDto, apiKey: string) =>
      request(app.getHttpServer())
        .get(`${endpoint}/most-polluted-time`)
        .query(query)
        .set(xApiKey, apiKey);

    it(`[SMOKE] should return ${HttpStatus.OK} in success case`, async () => {
      const res = await runTest(validQuery, apiKey);
      expect(res.status).toBe(HttpStatus.OK);
    });

    it(`[SECURITY] should return ${HttpStatus.UNAUTHORIZED} in success case`, async () => {
      const res = await runTest(validQuery, wrongKey);
      expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
    });
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });
});
