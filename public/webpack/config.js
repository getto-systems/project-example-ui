/* eslint-disable */
const path = require("path");
const TerserPlugin = require('terser-webpack-plugin');
const WorkerPlugin = require('worker-plugin');

module.exports = {
  entry: {
    "update": path.join(__dirname, "../../rollup/dist/public/update.js"),

    "auth": path.join(__dirname, "../../rollup/dist/public/auth.js"),
    "auth/password_login": path.join(__dirname, "../../rollup/dist/public/auth/password_login.js"),
    "auth/password_reset_session": path.join(__dirname, "../../rollup/dist/public/auth/password_reset_session.js"),
    "auth/password_reset": path.join(__dirname, "../../rollup/dist/public/auth/password_reset.js"),
  },
  output: {
    path: path.join(__dirname, "../dist"),
    filename: "[name].js",
    globalObject: "self",
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  plugins: [
    new WorkerPlugin(),
  ],
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
