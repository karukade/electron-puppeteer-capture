module.exports = {
  testEnvironment: 'node',
  runner: '@jest-runner/electron/main',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.+(ts|js)'],
  transform: { '^.+\\.ts$': 'ts-jest' }
};
