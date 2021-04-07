/* eslint-disable */
const fs = require("fs")
const path = require("path")

const environment = require("../env/environment")
const entryPoint = require("../env/entry_point")

const environmentRoot = path.join(__dirname, "../lib/y_environment")
dump(path.join(environmentRoot, "env.ts"), envContent())
dump(path.join(environmentRoot, "path.ts"), pathContent())

function envContent() {
    const isProduction = environment.isProduction()
    const version = (() => {
        if (isProduction) {
            return fs.readFileSync(path.join(__dirname, "../.release-version"), "utf8").trim()
        } else {
            return "dist"
        }
    })()

    const env = {
        version,
        isProduction,

        secureServerURL: process.env.SECURE_SERVER_URL,
        apiServerURL: process.env.API_SERVER_URL,

        database: {
            authn: "GETTO-EXAMPLE-AUTHN",
            season: "GETTO-EXAMPLE-SEASON",
            menuExpand: "GETTO-EXAMPLE-MENU-EXPAND",
        },
        storageKey: {
            authz: "GETTO-EXAMPLE-AUTHZ",
        },
    }

    return "export const env = " + JSON.stringify(env, null, "    ")
}

function pathContent() {
    const files = ["/storybook/index.html", "/coverage/lcov-report/index.html"].concat(
        entryPoint.findHtmlFiles(),
    )
    return ["export type StaticMenuPath =" + toTypeVariant(files)].join("\n")

    function toTypeVariant(files) {
        if (files.length === 0) {
            return " never"
        }
        const padding = "\n    | "
        return padding + files.map(JSON.stringify).join(padding)
    }
}

function dump(file, content) {
    console.log(file)
    console.log(content)
    fs.writeFileSync(file, content + "\n")
}
