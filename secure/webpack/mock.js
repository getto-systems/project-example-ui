/* eslint-disable */
const path = require("path")

module.exports = {
    entry: () => {
        return [
            {
                type: "x_preact/x_mock",
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
                acc[name] = path.join(__dirname, `../lib/${info.type}/${name}.ts`)
            })
            info.aliases.forEach((entry) => {
                entry.names.forEach((name) => {
                    acc[`${name}${info.suffix}`] = path.join(
                        __dirname,
                        `../lib/${info.type}/${entry.path}.ts`
                    )
                })
            })
            return acc
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
