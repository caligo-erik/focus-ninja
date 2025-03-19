module.exports = {
  preset: 'ts-jest', // Uses ts-jest for TypeScript support
  testEnvironment: 'node', // Ensures we use Node.js environment
  clearMocks: true, // Clears mocks between tests
  collectCoverage: false, // Enables test coverage reporting
  coverageDirectory: 'coverage', // Stores coverage reports in /coverage
  testMatch: ['**/__tests__/**/*.test.ts', '**/?(*.)+(spec|test).ts'], // Matches test files
  coveragePathIgnorePatterns: ['/auto/', '/.*?/auto/'],
  testTimeout: 600000, // 600 seconds
};
