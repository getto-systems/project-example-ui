/* eslint-disable */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  "collectCoverage": true,
  "collectCoverageFrom": [
    "lib/**/*.ts",
    "!lib/x_*/**",
    "!lib/y_*/**",
    "!lib/z_*/**",
    "!lib/**/tests/**",
    "!lib/**/main/**",
    "!lib/**/impl/*/**",
    "!lib/**/entryPoint.ts",
    "!lib/**/component.ts",
    "!lib/**/infra.ts",
    "!lib/**/mock.ts",
  ],
  "coverageThreshold": {
    "global": {
      "functions": 100,
    }
  },
  "coverageDirectory": "public/dist/coverage",
};
