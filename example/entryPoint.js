/* eslint-disable */

const fs = require("fs")
const path = require("path")

module.exports = {
    findPublicEntries,
    findSecureFiles,
    findSecureEntries,
}

function findPublicEntries() {
    return [
        "availability/moveToLatestVersion",
        "availability/moveToNextVersion",
        "auth/sign",
        "auth/notFound",
    ].reduce(toEntry("public"), {})
}

function findSecureFiles() {
    const root = path.join(__dirname, "./public/dist")
    return gatherFiles(root).map((file) => file.replace(root, ""))

    function gatherFiles(dir) {
        const files = []
        fs.readdirSync(dir, { withFileTypes: true }).forEach((file) => {
            if (file.isDirectory()) {
                if (isGatherDirectory(file.name)) {
                    gatherFiles(path.join(dir, file.name)).forEach((file) => {
                        files.push(file)
                    })
                }
            }
            if (file.isFile()) {
                if (file.name.endsWith(".html")) {
                    files.push(path.join(dir, file.name))
                }
            }
        })
        return files

        function isGatherDirectory(name) {
            const target = path.join(dir, name).replace(root, "")
            switch (target) {
                case "/coverage":
                case "/storybook":
                case "/css":
                case "/fonts":
                    return false

                default:
                    return true
            }
        }
    }
}
function findSecureEntries() {
    return findSecureFiles()
        .map((file) => file.replace("/", "").replace(/\.html$/, ""))
        .reduce(toEntry("secure"), {})
}

function toEntry(root) {
    return (acc, name) => {
        acc[name] = toMainPath(name)

        const worker = toWorkerPath(name)
        if (exists(worker)) {
            acc[`${name}.worker`] = worker
        }
        return acc
    }

    function toMainPath(file) {
        return toPath("main", file)
    }
    function toWorkerPath(file) {
        return toPath("worker", file)
    }
    function toPath(type, file) {
        return path.join(__dirname, "./lib/x_main", root, ...toSecureEntryPath(file), `${type}.ts`)
    }
    function toSecureEntryPath(file) {
        if (file.startsWith("auth/profile")) {
            return [file, "x_preact"]
        }
        if (file.startsWith("document/")) {
            return ["document"]
        }
        return [file]
    }

    function exists(file) {
        try {
            fs.accessSync(file)
            return true
        } catch (err) {
            return false
        }
    }
}
