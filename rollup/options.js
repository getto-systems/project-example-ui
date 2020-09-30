/* eslint-disable */
import typescript from "@rollup/plugin-typescript"
import { terser } from "rollup-plugin-terser"

const path = require("path");

export const options = {
  external: [
    "preact",
    "preact/hooks",
    "htm/preact",
    "protobufjs/minimal",
  ],
  output: {
    dir: path.join(__dirname, "./dist"),
    format: "es",
  },
  plugins: [
    typescript(),
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
