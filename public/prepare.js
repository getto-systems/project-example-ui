/* eslint-disable */
const fs = require("fs");
const path = require("path");

const isProduction = (process.env.BUILD_ENV == "PRODUCTION");
let version = (() => {
  if (isProduction) {
    return fs.readFileSync(path.join(__dirname, "../.release-version"), "utf8").trim();
  } else {
    return "dist";
  }
})();

const env = {
  version,

  secureServerHost: process.env.SECURE_SERVER_HOST,
  authServerURL: process.env.AUTH_SERVER_URL,

  storageKey: {
    ticketNonce: process.env.STORAGE_KEY_TICKET_NONCE,
    apiCredential: process.env.STORAGE_KEY_API_CREDENTIAL,
    lastAuthAt: process.env.STORAGE_KEY_LAST_AUTH_AT,
  },
};

const data = "export const env = " + JSON.stringify(env, null, "    ");

console.log(data);

fs.writeFileSync(path.join(__dirname, "lib/y_static/env.ts"), data);
