/* eslint-disable */
const path = require("path")

const WorkerPlugin = require("worker-plugin")
const TerserPlugin = require("terser-webpack-plugin")

const environment = require("../environment")
const entryPoint = require("../entry_point")

module.exports = {
    entry: entryPoint.findPublicEntries(),
    output: {
        path: path.join(__dirname, "./dist"),
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
    optimization: {
        minimize: environment.isProduction(),
        minimizer: [new TerserPlugin()],
    },
    plugins: [new WorkerPlugin()],
    watchOptions: {
        ignored: /(node_modules|.git)/,
    },
    devServer: {
        contentBase: path.join(__dirname, "."),
        publicPath: "/dist/",

        host: "0.0.0.0",
        port: process.env.PUBLIC_APP_PORT,

        hot: true,
        sockPort: "443",

        disableHostCheck: true,
    },
}
