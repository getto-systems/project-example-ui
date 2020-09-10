/* eslint-disable */
const path = require("path");

module.exports = {
  entry: {
    auth: path.join(__dirname, "lib/x_preact/auth.ts"),
    update: path.join(__dirname, "lib/x_update/update.ts"),
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
        resolve: {
          extensions: [".ts"],
        },
      },
      {
        test: /\.worker\.js$/,
        loader: "worker-loader",
      },
    ],
  },
  devServer: {
    contentBase: path.join(__dirname),
    publicPath: "/dist/",

    host: "0.0.0.0",
    port: process.env.PUBLIC_APP_PORT,

    hot: true,
    sockPort: "443",

    disableHostCheck: true,
  },
};
