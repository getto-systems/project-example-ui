/* eslint-disable */
const { toNamespacedPath } = require("path")
const path = require("path")

module.exports = {
    entry: () => {
        return [
            {
                type: "z_main",
                names: ["index"],
                aliases: [
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
                ],
            },
        ].reduce((acc, info) => {
            info.names.forEach((name) => {
                acc[toEntry(name)] = toPath(name)
            })
            info.aliases.forEach((entry) => {
                entry.names.forEach((name) => {
                    acc[toEntry(name)] = toPath(entry.path)
                })
            })
            return acc

            function toEntry(name) {
                return `${name}${info.suffix}`
            }
            function toPath(name) {
                return path.join(__dirname, `../lib/${info.type}/${name}/mock.ts`)
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
