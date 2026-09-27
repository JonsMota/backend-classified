const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './'
})

const customJestConfig = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  testMatch: ['**/tests/**/*.test.ts'],
  collectCoverageFrom: [
    'src/lib/**/*.ts',
    'src/logic/**/*.ts',
    'src/pages/api/**/*.ts',
    '!src/pages/api-doc.tsx'
  ]
}

module.exports = createJestConfig(customJestConfig)