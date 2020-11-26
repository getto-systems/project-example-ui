import { DocumentTarget, markDocumentTarget } from "../../content/data"

export function detectDocumentTarget(version: string, currentLocation: Location): DocumentTarget {
    const pathname = new URL(currentLocation.toString()).pathname
    const versionPrefix = `/${version}/`
    if (!pathname.startsWith(versionPrefix)) {
        return defaultDocumentTarget
    }

    const path = pathname.replace(versionPrefix, "/")
    switch (path) {
        case "/docs/index.html":
            return markDocumentTarget(path)
        default:
            return defaultDocumentTarget
    }
}

const defaultDocumentTarget = markDocumentTarget("/docs/index.html")
