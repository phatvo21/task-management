module.exports = {
   preset: "ts-jest",
   coverageThreshold: {
      global: {
         functions: 75,
         lines: 79,
         statements: 79,
      },
   },
   testTimeout: 10000,
   moduleFileExtensions: ["js", "jsx", "json", "ts", "tsx"],
   collectCoverage: true, // for getting covering there is command 'test-cover'
   verbose: false,
   collectCoverageFrom: [
      "**/**/*.ts",
      "!**/node_modules/**",
      "!**/build/**",
      "!**/coverage/**",
      "!dist/**",
      "!jest.config.js",
      "!**/test/**",
      "!test/**",
   ],
   transform: {
      "^.+\\.(ts|tsx)$": "ts-jest",
   },
   coverageReporters: ["text", "text-summary"],
   testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(js|ts)x?$",
   testPathIgnorePatterns: ["/node_modules/", "/build/", "/coverage/", "/dist/"],
   moduleNameMapper: {
      "@services/(.*)": "<rootDir>src/services/$1",
      "@constants/(.*)": "<rootDir>src/constants/$1",
      "@components/(.*)": "<rootDir>src/components/$1",
      "@helpers/(.*)": "<rootDir>src/helpers/$1",
      "@middlewares/(.*)": "<rootDir>src/middlewares/$1",
      "@utils/(.*)": "<rootDir>src/utils/$1",
      "@logging/(.*)": "<rootDir>src/logging/$1",
      "@databases/(.*)": "<rootDir>src/databases/$1",
      "@consoles/(.*)": "<rootDir>src/consoles/$1",
      "@repositories/(.*)": "<rootDir>src/repositories/$1",
   },
};
