import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { createDocument } from './swagger/swagger';
import { SwaggerModule } from '@nestjs/swagger';
import { CustomLogger } from './shared/custom-logger/custom-logger.service';
import { PerformanceMeasureHelper } from './shared/services/performance-measure.helper';
import * as winston from 'winston';
import * as os from 'os';
import { utilities, WinstonModule } from 'nest-winston';
import { ConfigModule } from '@nestjs/config';
import { Environment } from './shared/enums/env.enum';
import { NestExpressApplication } from '@nestjs/platform-express';

const appName = 'air-quality-api';

// load env variables stored in project root
ConfigModule.forRoot({
  envFilePath: ['../.env'],
  expandVariables: true,
});

// subscribe to performance measures to log measured performance values
// ! must be called after config module was initialized, as the this helper also accesses env variables
PerformanceMeasureHelper.initObserver();

async function bootstrap() {
  const pmBootstrap = new PerformanceMeasureHelper('main | bootstrap', true);
  // define format of log messages
  const pmLogging = new PerformanceMeasureHelper('main | logging setup', true);
  // ! do not change the order of the formats, otherwise one format might overwrite the other
  const winstonFormats: winston.Logform.Format[] = [
    // 1. add timestamp to each log message
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss.SSS ZZ',
    }),
    // 2. format log messages as json objects
    winston.format.json(),
  ];

  if (process.env.APP_ENV == Environment.Local) {
    // on localhost, pretty print the log messages using the nest-libraries
    // ! this must only be applied on localhost execution, otherwise this will screw up our logging-extension on Heroku
    winstonFormats.push(
      utilities.format.nestLike(appName, { prettyPrint: true }),
    );
  }

  // create logger being used by NestJS and the CustomLogger
  const logger = WinstonModule.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(...winstonFormats),
    defaultMeta: {
      app: appName,
      host: os.hostname(),
      env: process.env.APP_ENV,
    },
    transports: [new winston.transports.Console()],
  });
  pmLogging.end();

  // setup nestjs using custom winston logger
  const pmNestjsSetup = new PerformanceMeasureHelper(
    'main | nestjs setup',
    true,
  );
  const pmNestjsAppCreate = new PerformanceMeasureHelper(
    'main | nestjs app create',
    true,
  );
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule.withMongoose(
      process.env.MONGO_DB_URI || `mongodb://localhost:27017/airQualityDb`,
    ),
    {
      bufferLogs: true,
      // use winston as nestjs-logger -> logs during bootstrap will also be logged to winston
      logger: logger,
    },
  );
  const pmNestjsAppConfig = new PerformanceMeasureHelper(
    'main | nestjs app config',
    true,
  );
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  pmNestjsAppCreate.end();

  // sets global prefix for calls: /api/...
  app.setGlobalPrefix('api');

  app.enableShutdownHooks();

  // handle unhandled promise rejections
  process.on('unhandledRejection', (error: Error) => {
    // log unhandled promise rejection to prevent app from crashing
    const logger = new CustomLogger('process', 'onUnhandledRejection');
    logger.error(error);
  });

  process.on('uncaughtException', (error: Error) => {
    // log uncaught exception to prevent app from crashing
    const logger = new CustomLogger('process', 'onUncaughtException');
    logger.error(error);
  });

  // set timezone to UTC
  process.env.TZ = 'Etc/UTC';

  pmNestjsAppConfig.end();

  // swagger config
  const pmSwagger = new PerformanceMeasureHelper('main | swagger setup', true);
  const document = createDocument(app);
  SwaggerModule.setup('api/docs', app, document);
  const pmNestjsAppListen = new PerformanceMeasureHelper(
    'main | nestjs app listen',
    true,
  );
  pmSwagger.end();

  await app.listen(process.env.PORT || 4000, process.env.HOST || '0.0.0.0');
  pmNestjsAppListen.end();
  pmNestjsSetup.end();
  pmBootstrap.end();
}
bootstrap();
