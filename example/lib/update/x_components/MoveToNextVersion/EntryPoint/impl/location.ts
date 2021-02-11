import { AppTarget, markPageLocation, markVersion, Version } from "../../../../nextVersion/data"

export function detectAppTarget(version: string, currentURL: URL): AppTarget {
    const prefix = `/${version}/`
    const pathname = currentURL.pathname
    if (!pathname.startsWith(prefix)) {
        return { versioned: false, version: parseVersion(version) }
    }

    return {
        versioned: true,
        version: parseVersion(version),
        pageLocation: markPageLocation({
            pathname: pathname.replace(prefix, "/"),
            search: currentURL.search,
            hash: currentURL.hash,
        }),
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
