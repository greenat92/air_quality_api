import { CommandFactory } from 'nest-commander';

import { CommandsModule } from './commands/commands.module';

// application start via nest-commander
async function bootstrap() {
  await CommandFactory.run(CommandsModule);
}

bootstrap();
