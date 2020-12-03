/* eslint-disable */
const path = require("path")
const WorkerPlugin = require("worker-plugin")

module.exports = {
    entry: () => {
        return [
            { path: "index" },
            {
                path: "docs",
                names: [
                    "docs/index",
                    "docs/auth",
                    "docs/development/deployment",
                    "docs/development/auth/login",
                ],
            },
        ].reduce((acc, info) => {
            toNames().forEach((name) => {
                acc[name] = toMainPath()
                if (info.withWorker) {
                    acc[`${name}.worker`] = toWorkerPath()
                }
            })
            return acc

            function toNames() {
                if (!info.names) {
                    return [info.path]
                }
                return info.names
            }
            function toMainPath() {
                return toPath("main")
            }
            function toWorkerPath() {
                return toPath("worker")
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
