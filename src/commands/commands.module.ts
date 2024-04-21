import { Module } from '@nestjs/common';

import { TestDbSetupCommand } from './test-db-setup';

@Module({
  providers: [
    //
    TestDbSetupCommand,
  ],
})
export class CommandsModule {}
