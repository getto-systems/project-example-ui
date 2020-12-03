/* eslint-disable */
const path = require("path")
const WorkerPlugin = require("worker-plugin")

module.exports = {
    entry: () => {
        return [{ path: "update" }, { path: "login", withWorker: true }].reduce((acc, info) => {
            acc[info.path] = toMainPath()
            if (info.withWorker) {
                acc[`${info.path}.worker`] = toWorkerPath()
            }
            return acc

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
