/* eslint-disable */
const fs = require("fs")
const path = require("path")

const entryPoint = require("./entryPoint")

const environmentRoot = path.join(__dirname, "./lib/y_environment")
dump(path.join(environmentRoot, "env.ts"), envContent())
dump(path.join(environmentRoot, "path.ts"), pathContent())

function envContent() {
    const isProduction = process.env.BUILD_ENV == "production"
    const version = (() => {
        if (isProduction) {
            return fs.readFileSync(path.join(__dirname, "../.release-version"), "utf8").trim()
        } else {
            return "dist"
        }
    })()

    const env = {
        version,

        secureServerHost: process.env.SECURE_SERVER_HOST,
        apiServerURL: process.env.API_SERVER_URL,

        storageKey: {
            ticketNonce: process.env.STORAGE_KEY_TICKET_NONCE,
            apiCredential: process.env.STORAGE_KEY_API_CREDENTIAL,
            lastAuthAt: process.env.STORAGE_KEY_LAST_AUTH_AT,
            menuExpand: {
                main: process.env.STORAGE_KEY_MENU_EXPAND_MAIN,
                document: process.env.STORAGE_KEY_MENU_EXPAND_DOCUMENT,
            },
        },
    }

    return "export const env = " + JSON.stringify(env, null, "    ")
}

function pathContent() {
    const files = ["/storybook/index.html", "/coverage/lcov-report/index.html"].concat(
        entryPoint.findSecureFiles()
    )
    const documents = files.filter(isDocument)
    return [
        "export type StaticMenuPath =" + toTypeVariant(files),
        "export type StaticContentPath =" + toTypeVariant(documents),
        "export const staticContentPaths: StaticContentPath[] = " + toConstValue(documents),
    ].join("\n")

    function isDocument(file) {
        return file.startsWith("/document/")
    }

    function toTypeVariant(files) {
        const padding = "\n    | "
        return padding + files.map(toStringLiteral).join(padding)
    }
    function toConstValue(files) {
        return JSON.stringify(files, null, "    ")
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
