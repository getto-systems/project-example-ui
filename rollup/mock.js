/* eslint-disable */
import { options } from "./options"

const path = require("path");

const entrypoint = [
  { "public/update": path.join(__dirname, "../public/lib/x_update/update.ts") },
  { "public/auth": path.join(__dirname, "../public/lib/x_preact/mock/auth.ts") },

  { "public/auth": path.join(__dirname, "../public/lib/x_preact/mock/auth.ts") },

  //{ "secure/index": path.join(__dirname, "../secure/lib/x_preact/mock/home.ts") },
]

export default entrypoint.map((input) => {
  return { input, ...options };
})
