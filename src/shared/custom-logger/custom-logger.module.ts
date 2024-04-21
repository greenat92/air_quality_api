import { Module, Provider } from '@nestjs/common';
import { CustomLogger } from './custom-logger.service';

const customLoggerProvider: Provider = {
  provide: CustomLogger,
  useFactory: () => {
    // Here, you can provide the required parameters for CustomLogger
    return new CustomLogger('YourDefaultClassName');
  },
};

@Module({
  providers: [customLoggerProvider],
  exports: [customLoggerProvider],
})
export class CustomLoggerModule {}
