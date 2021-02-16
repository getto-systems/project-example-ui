import { GetSecureScriptPath, AuthLocationActionInfra } from "./infra"

import {
    GetSecureScriptPathAction_legacy,
    GetSecureScriptPathActionLocationInfo_legacy,
    GetSecureScriptPathLocationInfo,
} from "./action"

import { markLocationPathname, markSecureScriptPath, LocationPathname } from "./data"

export function initGetSecureScriptPathLocationInfo(
    currentURL: URL
): GetSecureScriptPathLocationInfo {
    return {
        getLocationPathname: () => detectPathname(currentURL),
    }
}

function detectPathname(currentURL: URL): LocationPathname {
    return markLocationPathname(currentURL.pathname)
}

export function initGetSecureScriptPathAction_legacy(
    infra: AuthLocationActionInfra,
    locationInfo: GetSecureScriptPathActionLocationInfo_legacy
): GetSecureScriptPathAction_legacy {
    return {
        get: getSecureScriptPath(infra)(locationInfo),
    }
}

export const getSecureScriptPath: GetSecureScriptPath = (infra) => (
    locationInfo
) => () => {
    const {
        config: { secureServerHost },
    } = infra

    const pagePathname = locationInfo.getLocationPathname()

    // アクセス中の html と同じパスで secure host に js がホストされている
    return markSecureScriptPath(
        `//${secureServerHost}${pagePathname.replace(/\.html$/, "")}.js`
    )
}
