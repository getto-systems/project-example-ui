/* eslint-disable */
const path = require("path");

module.exports = {
  entry: () => {
    const root = path.join(__dirname, "../lib");

    return [
      {
        type: "x_preact/mock",
        entries: [
          { path: "home.ts", names: ["index"] },
        ],
      },
    ].reduce((acc,info) => {
      info.entries.forEach((entry) => {
        entry.names.forEach((name) => {
          acc[name] = path.join(root, `/${info.type}/${entry.path}`);
        })
      })
      return acc;
    }, {})
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
  watchOptions: {
    ignored: /node_modules/,
  },
  devServer: {
    contentBase: path.join(__dirname, ".."),
    publicPath: "/dist/",

    host: "0.0.0.0",
    port: process.env.SECURE_APP_PORT,

    hot: true,
    sockPort: "443",
    sockHost: process.env.SECURE_SERVER_HOST,

    disableHostCheck: true,
  },
};
