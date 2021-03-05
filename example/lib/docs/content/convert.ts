import { ConvertLocationResult } from "../../z_vendor/getto-application/location/detecter"
import { ContentPath, contentPaths } from "./data"

export function contentPathLocationConverter(
    currentURL: URL,
    version: string,
): ConvertLocationResult<ContentPath> {
    const pathname = currentURL.pathname
    const versionPrefix = `/${version}/`
    if (!pathname.startsWith(versionPrefix)) {
        return { valid: false }
    }

    const path = pathname.replace(versionPrefix, "/")
    if (contentPaths.find((contentPath) => contentPath === path)) {
        // contentPaths は ContentPath[] なので、これに一致するなら ContentPath
        return { valid: true, value: markContentPath(path) }
    }
    return { valid: false }
}

function markContentPath(path: string): ContentPath {
    return path as ContentPath
}
