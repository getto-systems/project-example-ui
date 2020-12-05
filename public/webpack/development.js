/* eslint-disable */
const path = require("path")
const fs = require("fs")

const WorkerPlugin = require("worker-plugin")

const entryPoint = require("../entryPoint")

module.exports = {
    entry: () => {
        return entryPoint.find().reduce((acc, name) => {
            acc[name] = toMainPath(name)

            const worker = toWorkerPath(name)
            if (exists(worker)) {
                acc[`${name}.worker`] = worker
            }

            return acc
        }, {})

        function toMainPath(name) {
            return toPath("main", name)
        }
        function toWorkerPath(name) {
            return toPath("worker", name)
        }
        function toPath(type, name) {
            return path.join(__dirname, `../lib/z_main/${name}/${type}.ts`)
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
