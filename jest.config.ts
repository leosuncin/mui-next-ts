import nextJest from 'next/jest';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: '.',
});

const config = {
  moduleDirectories: ['node_modules', '.'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/src/$1',
    '^~api/(.*)$': '<rootDir>/src/pages/api/$1',
  },
};

export default createJestConfig(config);
