/* eslint-disable */
const path = require("path");

module.exports = {
  entry: {
    "update": path.join(__dirname, "../lib/x_update/update.ts"),
    "auth": path.join(__dirname, "../lib/x_preact/mock/auth.ts"),
  },
  output: {
    path: path.join(__dirname, "../dist"),
    filename: "[name].js",
    globalObject: "self",
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
  devServer: {
    contentBase: path.join(__dirname, ".."),
    publicPath: "/dist/",

    host: "0.0.0.0",
    port: process.env.PUBLIC_APP_PORT,

    hot: true,
    sockPort: "443",

    disableHostCheck: true,
  },
};
