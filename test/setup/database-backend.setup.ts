import { MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';

import { DatabaseHelper } from '../helpers/database.helper';
import {
  AirQualityRecord,
  AirQualityRecordSchema,
} from 'src/air-quality/air-quality.entity';

export async function setupDatabaseForBackendTesting(): Promise<void> {
  console.log('Setup of test-database for backend started');

  // run default setup

  // Initialize and set moduleRef globally
  const initializeModuleRef = async () => {
    if (!(global as any).moduleRef) {
      (global as any).moduleRef = await Test.createTestingModule({
        imports: [
          MongooseModule.forRoot(
            process.env.MONGO_DB_URI_TESTING ||
              `mongodb://localhost:27017/airQualityDbTest`,
          ),
          MongooseModule.forFeature([
            { name: AirQualityRecord.name, schema: AirQualityRecordSchema },
          ]),
        ],
      }).compile();
    }
  };

  // Initialize and set moduleRef globally
  await initializeModuleRef();
  await DatabaseHelper.defaultDbSetupForTesting();

  // data seeding required by backend e2e-testing is done as part of each test suite

  console.log('Setup of test-database for backend succeeded');
}
