export default {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    '^@/*/(.*)$': '<rootDir>/src/*/$1',
    '^@shared/*/(.*)$': '<rootDir>/src/shared/*/$1',
  },
};
