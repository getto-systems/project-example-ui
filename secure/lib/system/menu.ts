import { MenuTarget, markMenuTarget } from "../menu/data"

export function detectMenuPath(version: string, currentLocation: Location): MenuTarget {
    const pathname = new URL(currentLocation.toString()).pathname
    const versionPrefix = `/${version}/`
    if (!pathname.startsWith(versionPrefix)) {
        return markMenuTarget({ versioned: false, version })
    }
    return markMenuTarget({
        versioned: true,
        version,
        currentPath: pathname.replace(versionPrefix, ""),
    })
}
