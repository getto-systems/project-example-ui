import { DocumentPath, documentPaths } from "../../../content/data"

export function detectDocumentPath(version: string, currentLocation: Location): DocumentPath {
    const pathname = new URL(currentLocation.toString()).pathname
    const versionPrefix = `/${version}/`
    if (!pathname.startsWith(versionPrefix)) {
        return defaultDocumentTarget
    }

    const path = pathname.replace(versionPrefix, "/")
    if (documentPaths.find((documentPath) => documentPath === path)) {
        // documentPaths は DocumentPath[] なので、これに一致するなら DocumentPath
        return path as DocumentPath
    }
    return defaultDocumentTarget
}

const defaultDocumentTarget = "/docs/index.html"
