import { AppTarget, markPagePathname, markVersion, Version } from "../../../next_version/data"

export function detectAppTarget(version: string, currentLocation: Location): AppTarget {
    const prefix = `/${version}/`
    const pathname = new URL(currentLocation.toString()).pathname
    if (!pathname.startsWith(prefix)) {
        return { versioned: false, version: parseVersion(version) }
    }

    return {
        versioned: true,
        version: parseVersion(version),
        pagePathname: markPagePathname(pathname.replace(prefix, "/")),
    }
}

function parseVersion(version: string): Version {
    if (!version.match(/^[0-9]+\.[0-9]+\.[0-9]+([-+].*)?/)) {
        return markVersion({ valid: false })
    }

    const splits = version.split(".")

    return markVersion({
        valid: true,
        major: parseInt(splits[0]),
        minor: parseInt(splits[1]),
        patch: parseInt(splits[2]),
        suffix: suffix(splits[2], splits.slice(3)),
    })

    function suffix(patch: string, additional: string[]) {
        const suffix = patch.replace(/^[0-9]+/, "")
        return [suffix, ...additional].join(".")
    }
}
