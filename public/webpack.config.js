/* eslint-disable */
const path = require("path");
const WorkerPlugin = require('worker-plugin');

module.exports = {
  entry: {
    "update": path.join(__dirname, "lib/x_update/update.ts"),
    "auth": path.join(__dirname, "lib/x_preact/auth.ts"),

    "auth/load_application": path.join(__dirname, "lib/x_worker/auth/load_application.ts"),
    "auth/password_login": path.join(__dirname, "lib/x_worker/auth/password_login.ts"),
    "auth/password_reset_session": path.join(__dirname, "lib/x_worker/auth/password_reset_session.ts"),
  },
  output: {
    path: path.join(__dirname, "dist"),
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
  plugins: [
    new WorkerPlugin(),
  ],
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
