/* eslint-disable */
const fs = require("fs");
const path = require("path");

const env = {
  storageKey: {
    apiCredential: process.env.STORAGE_KEY_API_CREDENTIAL,
  },
};

const data = "export const env = " + JSON.stringify(env, null, "    ");

console.log(data);

fs.writeFileSync(path.join(__dirname, "./lib/y_static/env.ts"), data);
