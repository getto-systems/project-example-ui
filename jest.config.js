/* eslint-disable */
const fs = require("fs")
const path = require("path")

const specialPrefix = ["x_", "y_", "z_"]

function find(root) {
    const files = []
    fs.readdirSync(root, { withFileTypes: true }).forEach((file) => {
        if (file.isDirectory()) {
            if (!isSpecial(file.name)) {
                files.push(path.join(root, file.name, "**/*.ts"))
            }
        }
    })
    return files

    function isSpecial(name) {
        return specialPrefix.some((prefix) => name.startsWith(prefix))
    }
}

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  "collectCoverage": true,
  "collectCoverageFrom": [...find("public/lib"), ...find("secure/lib")],
  "coverageThreshold": {
    "global": {
      "statements": 100,
      "branches": 100,
      "functions": 100,
      "lines": 100
    }
  },
  "coverageDirectory": "public/dist/coverage",
};
