import { GetSecureScriptPathLocationInfo, GetSecureScriptPathPod } from "./method"

import { markLocationPathname, markSecureScriptPath, LocationPathname } from "./data"
import { GetSecureScriptPathInfra } from "./infra"

export function newGetSecureScriptPathLocationInfo(
    currentURL: URL,
): GetSecureScriptPathLocationInfo {
    return {
        getLocationPathname: () => detectPathname(currentURL),
    }
}

function detectPathname(currentURL: URL): LocationPathname {
    return markLocationPathname(currentURL.pathname)
}

interface GetSecureScriptPath {
    (infra: GetSecureScriptPathInfra): GetSecureScriptPathPod
}
export const getSecureScriptPath: GetSecureScriptPath = (infra) => (locationInfo) => () => {
    const {
        config: { secureServerHost },
    } = infra

    const pagePathname = locationInfo.getLocationPathname()

    // アクセス中の html と同じパスで secure host に js がホストされている
    return markSecureScriptPath(
        `https://${secureServerHost}${pagePathname.replace(/\.html$/, "")}.js`,
    )
}
