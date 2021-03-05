import { ConvertLocationResult } from "../../z_vendor/getto-application/location/detecter"
import { AppTarget, ParseVersionResult, Version } from "./data"

export function appTargetLocationConverter(
    currentURL: URL,
    version: string,
): ConvertLocationResult<AppTarget> {
    const prefix = `/${version}/`
    const pathname = currentURL.pathname
    if (!pathname.startsWith(prefix)) {
        return { valid: false }
    }

    return {
        valid: true,
        value: markAppTarget(pathname.replace(prefix, "/"), currentURL.search, currentURL.hash),
    }
}

export function versionConverter(version: string): ParseVersionResult {
    if (!version.match(/^[0-9]+\.[0-9]+\.[0-9]+([-+].*)?/)) {
        return { valid: false }
    }

    const splits = version.split(".")

    return {
        valid: true,
        value: markVersion({
            major: parseInt(splits[0]),
            minor: parseInt(splits[1]),
            patch: parseInt(splits[2]),
            suffix: suffix(splits[2], splits.slice(3)),
        }),
    }

    function suffix(patch: string, additional: string[]) {
        const suffix = patch.replace(/^[0-9]+/, "")
        return [suffix, ...additional].join(".")
    }
}

function markAppTarget(pathname: string, search: string, hash: string): AppTarget {
    return [pathname, search, hash].join("") as AppTarget
}

type Version_data = Readonly<{ major: number; minor: number; patch: number; suffix: string }>
function markVersion(version: Version_data): Version {
    return version as Version
}
