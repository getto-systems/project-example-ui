/* eslint-disable */
const path = require("path");
const TerserPlugin = require('terser-webpack-plugin');
const WorkerPlugin = require('worker-plugin');

module.exports = {
  entry: () => {
    const root = path.join(__dirname, "../rollup/dist/public");

    return [
      "update",

      "auth",

      "auth/password_login",
      "auth/password_reset_session",
      "auth/password_reset",
    ].reduce((acc,name) => {
      acc[name] = path.join(root, `${name}.js`);
      return acc;
    }, {})
  },
  output: {
    path: path.join(__dirname, "./dist"),
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
    contentBase: path.join(__dirname, "."),
    publicPath: "/dist/",

    host: "0.0.0.0",
    port: process.env.PUBLIC_APP_PORT,

    hot: true,
    sockPort: "443",

    disableHostCheck: true,
  },
};
