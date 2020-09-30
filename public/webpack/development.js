/* eslint-disable */
const path = require("path");
const WorkerPlugin = require('worker-plugin');

module.exports = {
  entry: () => {
    return [
      { type: "x_update", names: [ "update.ts" ] },
      { type: "x_preact", names: [ "auth.ts" ] },
      { type: "x_worker", names: [
        "auth/password_login.ts",
        "auth/password_reset_session.ts",
        "auth/password_reset.ts",
      ] },
    ].reduce((acc,info) => {
      info.names.forEach((name) => {
        acc[name] = path.join(__dirname, `../lib/${info.type}/${name}`);
      });
      return acc;
    }, {})
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
  plugins: [
    new WorkerPlugin(),
  ],
  watchOptions: {
    ignored: /node_modules/,
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
