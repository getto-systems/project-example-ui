const fs = require("fs");
const path = require("path");

const config = {
  isProduction: false,
  version: "dist",
};

if (process.env.BUILD_ENV) {
  config.isProduction = (process.env.BUILD_ENV == "PRODUCTION");
}
if (config.isProduction) {
  config.version = fs.readFileSync(path.join(__dirname, "../.release-version")).trim();
}

const data = "export const config = " + JSON.stringify(config, null, "  ");

console.log(data);

fs.writeFileSync(path.join(__dirname, "./src/config.js"), data);
