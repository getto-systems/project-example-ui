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
    "!lib/**/x_plain/**",
    "!lib/**/x_preact/**",
    "!lib/**/tests/**",
    "!lib/**/test.ts",
    "!lib/**/test_helper.ts",
    "!lib/**/init/**",
    "!lib/**/init.ts",
    "!lib/**/main/**",
    "!lib/**/main.ts",
    "!lib/**/infra/**",
    "!lib/**/infra.ts",
    "!lib/**/impl/*/**",
    "!lib/**/component.ts",
    "!lib/**/mock.ts",
  ],
  "coverageThreshold": {
    "global": {
      "functions": 100,
    }
  },
  "coverageDirectory": "public/dist/coverage",
};
