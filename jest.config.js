module.exports = {
  // A preset that is used as a base for Jest's configuration
  preset: 'ts-jest',
  // This will be used to configure minimum threshold enforcement for coverage results
  // With the following configuration jest will fail if there is less than around 80% branch,
  // line, and function coverage
  coverageThreshold: {
    global: {
      functions: 79,
      lines: 80,
      statements: 80,
    },
  },
  // Default timeout of a test in milliseconds.
  testTimeout: 10000,
  // An array of file extensions your modules use.
  // If you require modules without specifying a file extension,
  // these are the extensions Jest will look for, in left-to-right order
  moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,
  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: [
    '**/**/*.ts',
    '!**/node_modules/**',
    '!**/build/**',
    '!**/coverage/**',
    '!dist/**',
    '!jest.config.js',
    '!**/test/**',
    '!test/**',
    '!**/src/databases/migrations/**',
  ],
  // Indicates the code transformation into javascript when the test running
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  // A list of paths to modules that run some code to configure or set up the testing framework before each test file in the suite is executed
  // In this case indicates that the environment configuration will be executed before each test
  setupFiles: ['<rootDir>/test/env.ts'],
  // A list of reporter names that Jest uses when writing coverage reports
  coverageReporters: ['text', 'text-summary'],
  // The pattern or patterns Jest uses to detect test files
  // By default it looks for .js, .jsx, .ts and .tsx as well as any files with a suffix of .test or .spec
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(js|ts)x?$',
  // An array of regexp pattern strings that are matched against all test paths before executing the test.
  // If the test path matches any of the patterns, it will be skipped.
  testPathIgnorePatterns: ['/node_modules/', '/build/', '/coverage/', '/dist/'],
  // A map from regular expressions to module names or to arrays of module names that allow to stub out resources,
  // like images or styles with a single module.
  moduleNameMapper: {
    '^services/(.*)': '<rootDir>src/services/$1',
    '^components/(.*)': '<rootDir>src/components/$1',
    '^helpers/(.*)': '<rootDir>src/helpers/$1',
    '^middlewares/(.*)': '<rootDir>src/middlewares/$1',
    '^utils/(.*)': '<rootDir>src/utils/$1',
    '^logging/(.*)': '<rootDir>src/logging/$1',
    '^databases/(.*)': '<rootDir>src/databases/$1',
    '^repositories/(.*)': '<rootDir>src/repositories/$1',
    '^constants/(.*)': '<rootDir>src/constants/$1',
    '^consoles/(.*)': '<rootDir>src/consoles/$1',
  },
};
