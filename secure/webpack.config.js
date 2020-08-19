/* eslint-disable */
const fs = require("fs");
const path = require("path");

module.exports = {
  entry: () => {
    const entry = {};

    entry["index"]  = path.join(__dirname, "src/index");

    /*
    entry["docs/index"]  = path.join(__dirname, "src/docs/index.ts");
    entry["docs/server"] = path.join(__dirname, "src/docs/server.ts");
    entry["docs/id"]     = path.join(__dirname, "src/docs/id.ts");

    entry["docs/detail/server"] = path.join(__dirname, "src/docs/detail/server.ts");
    entry["docs/detail/id"]     = path.join(__dirname, "src/docs/detail/id.ts");
    */

    return entry;
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
      },
    ],
  },
  devServer: devServer(),
};

function devServer() {
  if (!process.env.WEBPACK_DEV_SERVER) {
    return {};
  }

  return {
    contentBase: path.join(__dirname),
    publicPath: "/dist/",

    host: "0.0.0.0",
    port: process.env.SECURE_APP_PORT,
    disableHostCheck: true,

    https: true,
    cert: fs.readFileSync(process.env.TLS_CERT),
    key: fs.readFileSync(process.env.TLS_KEY),

    hot: true,
    sockPort: `${process.env.LABO_PORT_PREFIX}${process.env.SECURE_PORT}`,
  };
}
