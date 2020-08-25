/* eslint-disable */
const fs = require("fs");
const path = require("path");

const env = {
  secureServerHost: process.env.SECURE_SERVER_HOST,
  authServerURL: process.env.AUTH_SERVER_URL,
};

const data = "export const env = " + JSON.stringify(env, null, "    ");

console.log(data);

fs.writeFileSync(path.join(__dirname, "src/y_static/env.ts"), data);
