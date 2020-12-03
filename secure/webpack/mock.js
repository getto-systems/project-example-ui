/* eslint-disable */
const path = require("path")

const entryPoint = require("../entryPoint")

module.exports = {
    entry: () => {
        return entryPoint.find().reduce((acc, file) => {
            acc[entryPoint.toEntryName(file)] = toMockPath(file)
            return acc
        }, {})

        function toMockPath(file) {
            return toPath("mock", file)
        }
        function toPath(type, file) {
            return path.join(__dirname, `../lib/z_main${entryPoint.toEntryPath(file)}/${type}.ts`)
        }
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
}
