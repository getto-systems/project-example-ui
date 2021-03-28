/* eslint-disable */
const path = require("path")
const fs = require("fs")

const postcss = require("postcss")
const autoprefixer = require("autoprefixer")

const CleanCss = require("clean-css")

compile({
    source: path.join(__dirname, "../css/site.css"),
    output: path.join(__dirname, "../public/dist/css/site.min.css"),
})

function compile({ source, output }) {
    process.chdir(path.dirname(source))

    fs.readFile(source, (_err, css) => {
        postcss([autoprefixer])
            .process(css, { from: source, to: output })
            .then((postcssResult) => {
                const result = new CleanCss({ level: 2 }).minify(postcssResult.css)
                if (result.errors.length > 0) {
                    console.error(result.errors)
                    process.exit(1)
                }
                if (result.warnings.length > 0) {
                    console.error(result.warnings)
                }

                console.log(`${source} -> ${output}`)
                fs.writeFile(output, result.styles, () => true)
            })
    })
}
