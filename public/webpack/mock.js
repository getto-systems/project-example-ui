/* eslint-disable */
const path = require("path")

const entryPoint = require("../entryPoint")

module.exports = {
    entry: () => {
        return entryPoint.find().reduce((acc, name) => {
            acc[name] = toMockPath(name)
            return acc
        }, {})

        function toMockPath(name) {
            return toPath("mock", name)
        }
        function toPath(type, name) {
            return path.join(__dirname, `../lib/z_main/${name}/${type}.ts`)
        }
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
}
