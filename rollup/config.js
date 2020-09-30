/* eslint-disable */
import typescript from "@rollup/plugin-typescript"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import { terser } from "rollup-plugin-terser"

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

const options = {
  external: [
    "protobufjs/minimal",
  ],
  output: {
    dir: path.join(__dirname, "./dist"),
    format: "es",
  },
  plugins: [
    typescript(),
    nodeResolve(),
    terser(),
  ],
  watch: {
    clearScreen: false,
    include: [
      "public/lib/**",
      "secure/lib/**",
    ],
  },
}

export default entrypoint.flatMap((info) => {
  return info.entries.flatMap((entry) => {
    return entry.names.map((name) => {
      const input = {};
      input[`${info.root}/${name}`] = path.join(__dirname, `../${info.root}/lib/${entry.type}/${name}`);
      return { input, ...options };
    })
  });
})
