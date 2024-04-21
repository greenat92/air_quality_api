declare global {
  namespace NodeJS {
    interface ProcessEnv {
      APP_ENV: 'dev' | 'staging' | 'prod' | 'local' | 'test';
      // test types
      TEST_TYPE: 'SMOKE' | 'E2E' | 'UNIT';
      // mongodatabase uri
      MONGO_DB_URI: string;

      // air qouality vars
      AIR_QUALITY_URL: string;
      AIR_QUALITY_API_KEY: string;

      // performance measuring
      PERFORMANCE_MEASURING_ENABLED: 'true' | 'false';

      //cron job
      CRON_EXPRESSION: string;

      // server
      HOST: string;
      PORT: number;

      // Database
      MONGO_DB_URI: string;
      DB_NAME: string;

      // Testing db

      MONGO_DB_URI_TESTING: string;
      TEST_DB_NAME: string;

      // air quality api
      AIR_QUALITY_URL: string;
      AIR_QUALITY_API_KEY: string;
      PARIS_LAT: number;
      PARIS_LON: number;
      CITY: string;

      // custom api key
      API_KEY: string;
    }
  }
}

export {};
