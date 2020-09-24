/* eslint-disable */
const path = require("path");
const WorkerPlugin = require('worker-plugin');

module.exports = {
  entry: () => {
    const entry = {};

    entry["index"]  = path.join(__dirname, "../lib/index");

    /*
    entry["docs/index"]  = path.join(__dirname, "../lib/docs/index.ts");
    entry["docs/server"] = path.join(__dirname, "../lib/docs/server.ts");
    entry["docs/id"]     = path.join(__dirname, "../lib/docs/id.ts");

    entry["docs/detail/server"] = path.join(__dirname, "../lib/docs/detail/server.ts");
    entry["docs/detail/id"]     = path.join(__dirname, "../lib/docs/detail/id.ts");
    */

    return entry;
  },
  output: {
    path: path.join(__dirname, "../dist"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
        resolve: {
          extensions: [".ts"],
        },
      },
    ],
  },
  plugins: [
    new WorkerPlugin(),
  ],
  devServer: {
    contentBase: path.join(__dirname, ".."),
    publicPath: "/dist/",

    host: "0.0.0.0",
    port: process.env.SECURE_APP_PORT,

    hot: true,
    sockPort: "443",

    disableHostCheck: true,
  },
};
