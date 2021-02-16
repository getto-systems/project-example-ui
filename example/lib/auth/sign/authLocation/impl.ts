import { GetSecureScriptPath, AuthLocationActionInfra } from "./infra"

import { AuthLocationAction, AuthLocationActionLocationInfo } from "./action"

import { markLocationPathname, markSecureScriptPath, LocationPathname } from "./data"

export function initAuthLocationActionLocationInfo(currentURL: URL): AuthLocationActionLocationInfo {
    return {
        getLocationPathname: () => detectPathname(currentURL),
    }
}

function detectPathname(currentURL: URL): LocationPathname {
    return markLocationPathname(currentURL.pathname)
}

export function initAuthLocationAction(
    infra: AuthLocationActionInfra,
    locationInfo: AuthLocationActionLocationInfo
): AuthLocationAction {
    return {
        getSecureScriptPath: getSecureScriptPath(infra)(locationInfo),
    }
}

const getSecureScriptPath: GetSecureScriptPath = (infra) => (locationInfo) => () => {
    const {
        config: { secureServerHost },
    } = infra

    const pagePathname = locationInfo.getLocationPathname()

    // アクセス中の html と同じパスで secure host に js がホストされている
    return markSecureScriptPath(`//${secureServerHost}${pagePathname.replace(/\.html$/, "")}.js`)
}
