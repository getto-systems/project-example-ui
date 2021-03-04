import { ConvertLocationResult } from "../../../../../z_vendor/getto-application/location/detecter"
import { ConvertSecureScriptResult, LocationPathname, SecureScriptPath } from "./data"

export function pathnameLocationConverter(
    currentURL: URL,
): ConvertLocationResult<LocationPathname> {
    const pathname = currentURL.pathname
    if (!pathname.endsWith(".html")) {
        return { valid: false }
    }
    return { valid: true, value: markLocationPathname(pathname) }
}

export function secureScriptPathConverter(
    secureServerURL: string,
    pathname: LocationPathname,
): ConvertSecureScriptResult {
    // アクセス中の html と同じパスで secure host に js がホストされている
    const scriptPath = pathname.replace(/\.html$/, ".js")
    return {
        valid: true,
        value: markSecureScriptPath(`${secureServerURL}${scriptPath}`),
    }
}

function markLocationPathname(pathname: string): LocationPathname {
    return pathname as LocationPathname
}
function markSecureScriptPath(path: string): SecureScriptPath {
    return path as SecureScriptPath
}
