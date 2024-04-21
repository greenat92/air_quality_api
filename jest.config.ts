import type { Config } from '@jest/types';
// test files to be executed based on TEST_TYPE
const getTestFileRegex = () => {
  switch (process.env.TEST_TYPE) {
    case 'E2E':
      return '^.+\\.e2e-spec\\.ts$';
    case 'UNIT':
      return '^.+\\spec\\.ts$';

    // in case of testing all files, use combined regex
    // this is also valid for smoke-testing, since we want to execute the smoke-tests of all test files
    default:
      return '^.+\\.(e2e-)?spec\\.ts$';
  }
};

const config: Config.InitialOptions = {
  // Automatically clear mock calls, instances and results before every test
  clearMocks: true,

  // Insert Jest's globals (expect, test, describe, beforeEach etc.) into the global environment.
  injectGlobals: true,

  // The maximum amount of workers used to run your tests. Can be specified as % or a number. E.g. maxWorkers: 10% will use 10% of your CPU amount + 1 as the maximum worker number. maxWorkers: 2 will use a maximum of 2 workers.
  //* during debugging, you probably want to set this to 1, which will cause the tests to be executed one after another instead of in parallel execution (which of course then will take longer to complete)
  // maxWorkers: '1',
  maxWorkers: '50%',

  // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
  moduleNameMapper: {
    'src/(.*)': '<rootDir>/src/$1',
    '@test/(.*)': '<rootDir>/src/test/$1',
  },

  // A list of paths to modules that run some code to configure or set up the testing framework before each test
  setupFilesAfterEnv: [],

  transform: {
    // taken from: https://kulshekhar.github.io/ts-jest/docs/getting-started/options
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        isolatedModules: true,
      },
    ],
  },

  // The test environment that will be used for testing
  testEnvironment: 'node',

  // test files to be executed based on TEST_TYPE
  testRegex: getTestFileRegex(),

  // in case of smoke testing, only execute tests that are labeled accordingly
  // otherwise, keep filter unset
  testNamePattern: ['SMOKE'].includes(process.env.TEST_TYPE)
    ? '\\[SMOKE\\] '
    : undefined,

  // Indicates whether each individual test should be reported during the run
  verbose: true,
};

// other Jest config options
export default config;
