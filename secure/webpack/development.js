/* eslint-disable */
const path = require("path")
const WorkerPlugin = require("worker-plugin")

module.exports = {
    entry: () => {
        return [
            {
                type: "x_preact/x_main",
                suffix: "",
                names: ["index"],
            },
            {
                type: "x_worker/x_main",
                suffix: ".worker",
                names: [],
            },
        ].reduce((acc, info) => {
            info.names.forEach((name) => {
                acc[`${name}${info.suffix}`] = path.join(__dirname, `../lib/${info.type}/${name}.ts`)
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
    plugins: [new WorkerPlugin()],
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
