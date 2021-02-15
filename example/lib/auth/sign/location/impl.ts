import { GetSecureScriptPath, LocationActionInfra } from "./infra"

import { LocationAction, LocationActionLocationInfo } from "./action"

import { markPagePathname, markScriptPath, PagePathname } from "./data"

export function initLocationActionLocationInfo(currentURL: URL): LocationActionLocationInfo {
    return {
        getPagePathname: () => detectPagePathname(currentURL),
    }
}

function detectPagePathname(currentURL: URL): PagePathname {
    return markPagePathname(currentURL.pathname)
}

export function initLocationAction(
    locationInfo: LocationActionLocationInfo,
    infra: LocationActionInfra
): LocationAction {
    return {
        getSecureScriptPath: getSecureScriptPath(infra)(locationInfo),
    }
}

const getSecureScriptPath: GetSecureScriptPath = (infra) => (locationInfo) => () => {
    const {
        config: { secureServerHost },
    } = infra

    const pagePathname = locationInfo.getPagePathname()

    // アクセス中の html と同じパスで secure host に js がホストされている
    return markScriptPath(`//${secureServerHost}${pagePathname.replace(/\.html$/, "")}.js`)
}
