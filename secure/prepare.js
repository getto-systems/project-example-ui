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

  storageKey: {
    apiCredential: process.env.STORAGE_KEY_API_CREDENTIAL,
    menuExpand: {
        main: process.env.STORAGE_KEY_MENU_EXPAND_MAIN,
        document: process.env.STORAGE_KEY_MENU_EXPAND_DOCUMENT,
    },
  },
};

const data = "export const env = " + JSON.stringify(env, null, "    ");

console.log(data);

fs.writeFileSync(path.join(__dirname, "./lib/y_static/env.ts"), data);
