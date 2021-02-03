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
        authServerURL: process.env.AUTH_SERVER_URL,

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
    const files = ["/storybook/index.html"].concat(entryPoint.findSecureFiles())
    const docs = files.filter(isDocs)
    return [
        "export type StaticMenuPath =" + toTypeVariant(files),
        "export type StaticContentPath =" + toTypeVariant(docs),
        "export const staticContentPaths: StaticContentPath[] = " + toConstValue(docs),
    ].join("\n")

    function isDocs(file) {
        return file.startsWith("/docs/")
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
