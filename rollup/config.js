/* eslint-disable */
import { options } from "./options"

const path = require("path");

const root = path.join(__dirname, "../public/lib")

const entrypoint = [
  {
    root: "public",
    entries: [
      { type: "x_update", names: [ "update" ] },
      { type: "x_preact", names: [ "auth" ] },
      { type: "x_worker", names: [
        "auth/password_login",
        "auth/password_reset_session",
        "auth/password_reset",
      ] },
    ],
  },
  {
    root: "secure",
    entries: [
      { type: "x_preact", names: [ "home" ] },
    ],
  },
]

export default entrypoint.flatMap((info) => {
  return info.entries.flatMap((entry) => {
    return entry.names.map((name) => {
      const input = {};
      input[`${info.root}/${name}`] = path.join(__dirname, `../${info.root}/lib/${entry.type}/${name}.ts`);
      return { input, ...options };
    })
  });
})
