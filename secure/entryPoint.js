/* eslint-disable */
const fs = require("fs")
const path = require("path")

module.exports = {
    find,
    toEntryName,
    toEntryPath,
}

function find() {
    const root = path.join(__dirname, "../public/dist")
    return gatherFiles(root).map((file) => file.replace(root, ""))

    function gatherFiles(dir) {
        const files = []
        fs.readdirSync(dir, { withFileTypes: true }).forEach((file) => {
            if (file.isDirectory()) {
                gatherFiles(path.join(dir, file.name)).forEach((file) => {
                    files.push(file)
                })
            }
            if (file.isFile()) {
                if (file.name.endsWith(".html")) {
                    files.push(path.join(dir, file.name))
                }
            }
        })
        return files
    }
}

function toEntryName(file) {
    return file.replace("/", "").replace(/\.html$/, "")
}
function toEntryPath(file) {
    if (file.startsWith("/docs/")) {
        return "/docs"
    }
    return file.replace(/\.html$/, "")
}
