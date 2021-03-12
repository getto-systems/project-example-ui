/* eslint-disable */
const path = require("path")
const fs = require("fs")

const WorkerPlugin = require("worker-plugin")
const TerserPlugin = require("terser-webpack-plugin")

const entryPoint = require("../entry_point")

module.exports = {
    entry: entryPoint.findSecureEntries(),
    output: {
        path: path.join(__dirname, "./dist"),
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
    optimization: {
        minimize: process.env.BUILD_ENV == "production",
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
        port: process.env.SECURE_APP_PORT,

        hot: true,
        sockPort: "443",
        sockHost: process.env.SECURE_SERVER_HOST,

        disableHostCheck: true,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization",
        },
    },
}
