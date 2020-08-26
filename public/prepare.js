/* eslint-disable */
const fs = require("fs");
const path = require("path");

const env = {
  isProduction: false,
  version: "dist",

  secureServerHost: process.env.SECURE_SERVER_HOST,
  authServerURL: process.env.AUTH_SERVER_URL,
};

if (process.env.BUILD_ENV) {
  env.isProduction = (process.env.BUILD_ENV == "PRODUCTION");
}
if (env.isProduction) {
  env.version = fs.readFileSync(path.join(__dirname, "../.release-version"), "utf8").trim();
}

const data = "export const env = " + JSON.stringify(env, null, "    ");

console.log(data);

fs.writeFileSync(path.join(__dirname, "lib/y_static/env.ts"), data);
