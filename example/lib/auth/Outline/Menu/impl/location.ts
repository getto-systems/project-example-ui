import { MenuTarget, markMenuTarget } from "../../../permission/menu/data"

export function detectMenuTarget(version: string, currentURL: URL): MenuTarget {
    const pathname = currentURL.pathname
    const versionPrefix = `/${version}/`
    if (!pathname.startsWith(versionPrefix)) {
        return markMenuTarget({ versioned: false, version })
    }
    return markMenuTarget({
        versioned: true,
        version,
        currentPath: pathname.replace(versionPrefix, "/"),
    })
}
