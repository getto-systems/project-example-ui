/* eslint-disable */
const path = require("path");

module.exports = {
  entry: () => {
    return [
      { type: "x_update", names: [ "update" ] },
      { type: "x_preact/mock", names: [ "auth" ] },
    ].reduce((acc,info) => {
      info.names.forEach((name) => {
        acc[name] = path.join(__dirname, `../lib/${info.type}/${name}.ts`);
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
