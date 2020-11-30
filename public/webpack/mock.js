/* eslint-disable */
const path = require("path")

module.exports = {
    entry: () => {
        return [{ path: "update" }, { path: "auth" }].reduce((acc, info) => {
            acc[info.path] = toMockPath()
            return acc

            function toMockPath() {
                return toPath("main")
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
