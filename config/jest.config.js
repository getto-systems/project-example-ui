/* eslint-disable */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    rootDir: "../lib",
    collectCoverage: true,
    collectCoverageFrom: [
        "**/*.ts",
        "!**/x_*/**",
        "!**/y_*/**",
        "!**/z_*/**",
        "!**/test.ts",
        "!**/test_helper.ts",
        "!**/init/**",
        "!**/init.ts",
        "!**/infra/**",
        "!**/infra.ts",
        "!**/mock.ts",
        "!**/docs.ts",
    ],
    coverageThreshold: {
        global: {
            functions: 100,
        },
    },
    coverageDirectory: "../public/dist/coverage",
}
