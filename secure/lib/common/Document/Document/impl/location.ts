import { DocumentPath } from "../../../content/data"

export function detectDocumentPath(version: string, currentLocation: Location): DocumentPath {
    const pathname = new URL(currentLocation.toString()).pathname
    const versionPrefix = `/${version}/`
    if (!pathname.startsWith(versionPrefix)) {
        return defaultDocumentTarget
    }

    const path = pathname.replace(versionPrefix, "/")
    switch (path) {
        case "/docs/index.html":
        case "/docs/auth.html":
        case "/docs/development/deployment.html":
        case "/docs/development/auth/login.html":
            return path
        default:
            return defaultDocumentTarget
    }
}

const defaultDocumentTarget = "/docs/index.html"
