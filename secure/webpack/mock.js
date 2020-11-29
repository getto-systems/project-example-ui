/* eslint-disable */
const { toNamespacedPath } = require("path")
const path = require("path")

module.exports = {
    entry: () => {
        return [
            { path: "index" },
            {
                path: "docs",
                names: [
                    "docs/index",
                    "docs/server",
                    "docs/detail/server",
                    "docs/auth",
                    "docs/detail/auth",
                ],
            },
        ].reduce((acc, info) => {
            toNames().forEach((name) => {
                acc[name] = toMockPath()
            })
            return acc

            function toNames() {
                if (!info.names) {
                    return [info.path]
                }
                return info.names
            }
            function toMockPath() {
                return toPath("mock")
            }
            function toPath(type) {
                return path.join(__dirname, `../lib/z_main/${info.path}/${type}.ts`)
            }
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
}
