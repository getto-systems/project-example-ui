import { GetSecureScriptPath, LocationActionInfra } from "./infra"

import { LocationAction, LocationActionLocationInfo, LocationActionPod } from "./action"

import { markPagePathname, markScriptPath, PagePathname } from "./data"

export function detectPagePathname(currentURL: URL): PagePathname {
    return markPagePathname(currentURL.pathname)
}

export function initLocationAction(
    pod: LocationActionPod,
    locationInfo: LocationActionLocationInfo
): LocationAction {
    return {
        getSecureScriptPath: pod.initGetSecureScriptPath(locationInfo),
    }
}
export function initLocationActionPod(infra: LocationActionInfra): LocationActionPod {
    return {
        initGetSecureScriptPath: getSecureScriptPath(infra),
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
