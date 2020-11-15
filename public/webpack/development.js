/* eslint-disable */
const path = require("path")
const WorkerPlugin = require("worker-plugin")

module.exports = {
    entry: () => {
        return [
            { type: "x_update/x_main", names: ["update"], suffix: "" },
            { type: "x_preact/x_main", names: ["auth"], suffix: "" },
            { type: "x_worker/x_main", names: ["auth"], suffix: ".worker" },
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
    plugins: [new WorkerPlugin()],
    watchOptions: {
        ignored: /node_modules/,
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
