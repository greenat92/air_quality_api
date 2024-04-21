import { getModelToken } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { AirQualityRecord } from 'src/air-quality/air-quality.entity';

export abstract class DatabaseHelper {
  /**
   * Perform default database setup for testing.
   */
  static async defaultDbSetupForTesting(): Promise<void> {
    try {
      await this.connectToMongo();
      await this.clearAirQualityCollection();
      await this.seedData();
    } catch (error) {
      console.error('Error during database setup:', error);
      throw error;
    } finally {
      await this.disconnectFromMongo();
    }
  }

  /**
   * Connect to MongoDB.
   */
  private static async connectToMongo(): Promise<void> {
    const mongoUri =
      process.env.MONGO_DB_URI_TESTING ||
      `mongodb://localhost:27017/airQualityDbTest`;

    try {
      await mongoose.connect(mongoUri);
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw error;
    }
  }

  /**
   * Disconnect from MongoDB.
   */
  private static async disconnectFromMongo(): Promise<void> {
    try {
      await mongoose.disconnect();
    } catch (error) {
      console.error('Error disconnecting from MongoDB:', error);
      throw error;
    }
  }

  /**
   * Clear the AirQualityRecord collection.
   */
  private static async clearAirQualityCollection(): Promise<void> {
    const airQualityModel = this.getAirQualityModel();
    await airQualityModel.deleteMany({});
  }

  /**
   * Seed initial data into the AirQualityRecord collection.
   */
  private static async seedData(): Promise<void> {
    const airQualityModel = this.getAirQualityModel();

    const records = [
      {
        ts: new Date(),
        maincn: 'Good',
        mainus: 'Good',
        aqius: 50,
        aqicn: 50,
        location: {
          type: 'Point',
          coordinates: [2.34, 40.34],
        },
        country: 'France',
        state: 'Ile-de-France',
        city: 'Paris',
      },
      // add more seed data as needed
    ];

    await airQualityModel.insertMany(records);
  }

  /**
   * Retrieve the AirQualityRecord model from the NestJS DI container.
   */
  private static getAirQualityModel(): Model<AirQualityRecord> {
    if (!(global as any).moduleRef) {
      console.error('moduleRef is not initialized');
      throw new Error('moduleRef is not initialized');
    }

    const model = (global as any).moduleRef.get(
      getModelToken(AirQualityRecord.name),
    ) as Model<AirQualityRecord>;

    if (!model) {
      console.error('AirQualityRecord model not found');
      throw new Error('AirQualityRecord model not found');
    }

    return model;
  }

  // Add more utility methods as needed for your testing scenarios
}
