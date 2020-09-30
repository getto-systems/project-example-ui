/* eslint-disable */
import { options } from "./options"

const path = require("path");

const entrypoint = [
  {
    root: "public",
    entries: [
      { type: "x_update", names: [ "update.ts" ] },
      { type: "x_preact", names: [ "auth.ts" ] },
      { type: "x_worker", names: [
        "auth/password_login.ts",
        "auth/password_reset_session.ts",
        "auth/password_reset.ts",
      ] },
    ],
  },
  {
    root: "secure",
    entries: [
      { type: "x_preact", names: [ "home.ts" ] },
    ],
  },
]

export default entrypoint.flatMap((info) => {
  return info.entries.flatMap((entry) => {
    return entry.names.map((name) => {
      const input = {};
      input[`${info.root}/${name}`] = path.join(__dirname, `../${info.root}/lib/${entry.type}/${name}`);
      return { input, ...options };
    })
  });
})
