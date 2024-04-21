import 'tsconfig-paths/register';

import { Command, CommandRunner } from 'nest-commander';
import { setupDatabaseForBackendTesting } from 'test/setup/database-backend.setup';

enum System {
  Backend = 'backend',
  // can be added other system here
}

@Command({
  name: 'test-db-setup',
  description: 'Will setup test-database for e2e-testing',
})
export class TestDbSetupCommand extends CommandRunner {
  async run(passedParams: string[]): Promise<void> {
    if (passedParams == null || passedParams.length == 0) {
      throw new Error(
        `no system specified as parameter. Please specify one of the following: ${Object.values(System).join(', ')}`,
      );
    } else if (passedParams.length != 1) {
      throw new Error(`only one system may be specified as a parameter.`);
    } else {
      const system = passedParams.pop();
      switch (system) {
        case System.Backend:
          await setupDatabaseForBackendTesting();
          break;
        default:
          throw new Error(
            `invalid system '${system}' specified as parameter. Please specify one of the following: ${Object.values(System).join(', ')}`,
          );
      }
    }

    console.log(`command executed successfully`);
  }
}
