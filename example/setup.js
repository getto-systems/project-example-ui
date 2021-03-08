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

        secureServerURL: process.env.SECURE_SERVER_URL,
        apiServerURL: process.env.API_SERVER_URL,

        storageKey: {
            authn: "GETTO-EXAMPLE-AUTHN",
            authz: "GETTO-EXAMPLE-AUTHZ",
            menuExpand: {
                home: "GETTO-EXAMPLE-MENU-EXPAND-HOME",
                docs: "GETTO-EXAMPLE-MENU-EXPAND-DOCS",
            },
        },
    }

    return "export const env = " + JSON.stringify(env, null, "    ")
}

function pathContent() {
    const files = ["/storybook/index.html", "/coverage/lcov-report/index.html"].concat(
        entryPoint.findSecureFiles(),
    )
    const documents = files.filter(isDocument)
    return [
        "export type StaticMenuPath =" + toTypeVariant(files),
        "export type StaticContentPath =" + toTypeVariant(documents),
        "export const staticContentPaths: StaticContentPath[] = " + toConstValue(documents),
    ].join("\n")

    function isDocument(file) {
        return file.startsWith(`/${entryPoint.docsDirectory}/`)
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
