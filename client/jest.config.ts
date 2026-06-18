import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',

  testEnvironment: 'jsdom',

  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.ts',
  ],

  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: {
          jsx: 'react-jsx',
        },
      },
    ],
  },

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$':
      'identity-obj-proxy',
  },

  collectCoverage: true,

  collectCoverageFrom: [
    'src/lib/**/*.ts',
    'src/config.ts',
    'src/constants/**/*.ts',
  ],

  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
}

export default config