/* eslint-disable */
const path = require("path");
const TerserPlugin = require('terser-webpack-plugin');
const WorkerPlugin = require('worker-plugin');

module.exports = {
  entry: () => {
    const root = path.join(__dirname, "../rollup/dist/secure");

    return [
      [ "home", ["index"] ],
    ].reduce((acc,info) => {
      const [js, names] = info;
      names.forEach((name) => {
        acc[name] = path.join(root, `${js}.js`);
      })
      return acc;
    }, {})
  },
  output: {
    path: path.join(__dirname, "./dist"),
    filename: "[name].js",
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  plugins: [
    new WorkerPlugin(),
  ],
};
