import { ContentPath, contentPaths } from "../../../content/data"

export function detectContentPath(version: string, currentLocation: Location): ContentPath {
    const pathname = new URL(currentLocation.toString()).pathname
    const versionPrefix = `/${version}/`
    if (!pathname.startsWith(versionPrefix)) {
        return defaultDocumentTarget
    }

    const path = pathname.replace(versionPrefix, "/")
    if (contentPaths.find((contentPath) => contentPath === path)) {
        // contentPaths は ContentPath[] なので、これに一致するなら ContentPath
        return path as ContentPath
    }
    return defaultDocumentTarget
}

const defaultDocumentTarget = "/docs/index.html"
