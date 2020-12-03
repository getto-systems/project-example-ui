/* eslint-disable */
const fs = require("fs")
const path = require("path")

const entryPoint = require("./entryPoint")

function dumpEnv() {
    const isProduction = process.env.BUILD_ENV == "PRODUCTION"
    let version = (() => {
        if (isProduction) {
            return fs.readFileSync(path.join(__dirname, "../.release-version"), "utf8").trim()
        } else {
            return "dist"
        }
    })()

    const env = {
        version,

        storageKey: {
            apiCredential: process.env.STORAGE_KEY_API_CREDENTIAL,
            menuExpand: {
                main: process.env.STORAGE_KEY_MENU_EXPAND_MAIN,
                document: process.env.STORAGE_KEY_MENU_EXPAND_DOCUMENT,
            },
        },
    }

    dump(
        path.join(__dirname, "./lib/y_static/env.ts"),
        "export const env = " + JSON.stringify(env, null, "    ")
    )
}

function dumpEntryPoint() {
    const files = entryPoint.find()
    const padding = "\n    | "
    dump(
        path.join(__dirname, "./lib/y_static/path.ts"),
        [
            "export type StaticMenuPath =" + toTypeVariant(files),
            "export type StaticDocumentPath =" + toTypeVariant(files.filter(docs)),
        ].join("\n")
    )

    function docs(file) {
        return file.startsWith("/docs/")
    }

    function toTypeVariant(files) {
        return padding + files.map(toStringLiteral).join(padding)
    }
    function toStringLiteral(file) {
        return `"${file}"`
    }
}

function dump(file, content) {
    console.log(file)
    console.log(content)
    fs.writeFileSync(file, content + "\n")
}

dumpEnv()
dumpEntryPoint()
