/* eslint-disable */
const path = require("path")
const fs = require("fs")

const WorkerPlugin = require("worker-plugin")

const entryPoint = require("./entryPoint")

module.exports = {
    entry: () => {
        return entryPoint.find().reduce((acc, file) => {
            const name = entryPoint.toEntryName(file)
            acc[name] = toMainPath(file)

            const worker = toWorkerPath(file)
            if (exists(worker)) {
                acc[`${name}.worker`] = worker
            }

            return acc
        }, {})

        function toMainPath(file) {
            return toPath("main", file)
        }
        function toWorkerPath(file) {
            return toPath("worker", file)
        }
        function toPath(type, file) {
            return path.join(__dirname, `./lib/z_main${entryPoint.toEntryPath(file)}/${type}.ts`)
        }

        function exists(file) {
            try {
                fs.accessSync(file)
                return true
            } catch (err) {
                return false
            }
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
