/* eslint-disable */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  "collectCoverage": true,
  "collectCoverageFrom": [
    "public/lib/**/*.ts",
    "!public/lib/x_*/**",
    "!public/lib/y_*/**",
    "!public/lib/z_*/**",
    "!public/lib/**/main/**",
    "!public/lib/**/impl/*/**",
    "!public/lib/**/view.ts",
    "!public/lib/**/component.ts",
    "!public/lib/**/infra.ts",
    "!public/lib/**/mock.ts",
  ],
  "coverageThreshold": {
    "global": {
      "functions": 100,
    }
  },
  "coverageDirectory": "public/dist/coverage",
};
