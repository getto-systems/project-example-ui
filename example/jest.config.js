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
    "!lib/**/test.ts",
    "!lib/**/test_helper.ts",
    "!lib/**/init/**",
    "!lib/**/init.ts",
    "!lib/**/infra/**",
    "!lib/**/infra.ts",
    "!lib/**/mock.ts",
    "!lib/**/docs.ts",
  ],
  "coverageThreshold": {
    "global": {
      "functions": 100,
    }
  },
  "coverageDirectory": "public/dist/coverage",
};
