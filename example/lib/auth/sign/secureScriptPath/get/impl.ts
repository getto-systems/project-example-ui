import { GetSecureScriptPath, AuthLocationActionInfra } from "./infra"

import { GetSecureScriptPathAction, GetSecureScriptPathActionLocationInfo } from "./action"

import { markLocationPathname, markSecureScriptPath, LocationPathname } from "./data"

export function initGetSecureScriptPathActionLocationInfo(
    currentURL: URL
): GetSecureScriptPathActionLocationInfo {
    return {
        getLocationPathname: () => detectPathname(currentURL),
    }
}

function detectPathname(currentURL: URL): LocationPathname {
    return markLocationPathname(currentURL.pathname)
}

export function initGetSecureScriptPathAction(
    infra: AuthLocationActionInfra,
    locationInfo: GetSecureScriptPathActionLocationInfo
): GetSecureScriptPathAction {
    return {
        get: get(infra)(locationInfo),
    }
}

const get: GetSecureScriptPath = (infra) => (locationInfo) => () => {
    const {
        config: { secureServerHost },
    } = infra

    const pagePathname = locationInfo.getLocationPathname()

    // アクセス中の html と同じパスで secure host に js がホストされている
    return markSecureScriptPath(`//${secureServerHost}${pagePathname.replace(/\.html$/, "")}.js`)
}
