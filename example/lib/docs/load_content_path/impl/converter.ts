import { ConvertLocationResult } from "../../../z_vendor/getto-application/location/data"
import { DocsContentPath, docsContentPaths } from "../data"

export function docsContentPathLocationConverter(
    currentURL: URL,
    version: string,
): ConvertLocationResult<DocsContentPath> {
    const pathname = currentURL.pathname
    const versionPrefix = `/${version}/`
    if (!pathname.startsWith(versionPrefix)) {
        return { valid: false }
    }

    const path = pathname.replace(versionPrefix, "/")
    if (docsContentPaths.find((contentPath) => contentPath === path)) {
        // contentPaths は ContentPath[] なので、これに一致するなら ContentPath
        return { valid: true, value: markDocsContentPath(path) }
    }
    return { valid: false }
}

function markDocsContentPath(path: string): DocsContentPath {
    return path as DocsContentPath
}
