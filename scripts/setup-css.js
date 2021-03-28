/* eslint-disable */
const path = require("path")
const fs = require("fs")

const postcss = require("postcss")
const autoprefixer = require("autoprefixer")

const CleanCss = require("clean-css")

const source = path.join(__dirname, "../css/site.css")
const output = path.join(__dirname, "../public/dist/css/site.min.css")

process.chdir(path.dirname(source))

fs.readFile(source, (_err, css) => {
    postcss([autoprefixer])
        .process(css, { from: source, to: output })
        .then((processed) => {
            const result = new CleanCss({ level: 2 }).minify(processed.css)
            if (result.errors.length > 0) {
                console.error(result.errors)
                process.exit(1)
            }
            if (result.warnings.length > 0) {
                console.error(result.warnings)
            }
            fs.writeFile(output, result.styles, () => true)
        })
})
