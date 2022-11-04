module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{ts,tsx}',
    '!**/application/**',
    '!**/protocols/**',
    '!**/mocks/**',
    '!**/index.{ts,tsx}',
    '!**/**.factory.{ts,tsx}',
    '!**/**.styles.ts',
    '!**/**.constants.{ts,tsx}',
    '!**/**.d.ts'
  ],
  testResultsProcessor: 'jest-sonar-reporter',
  coverageDirectory: 'coverage',
  testEnvironment: 'jsdom',
  transform: {
    '.+\\.(ts|tsx)$': 'ts-jest'
  },
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
    '\\.styles.ts$': 'identity-obj-proxy'
  }
}
