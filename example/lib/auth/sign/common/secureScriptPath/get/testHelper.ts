import { initLocationDetecter } from "../../../../../z_vendor/getto-application/location/testHelper"

import { detectPathname } from "./impl"

import { GetSecureScriptPathLocationDetecter } from "./method"

import { SecureScriptPath } from "./data"

export function initSecureScriptPathLocationDetecter(
    currentURL: URL,
): GetSecureScriptPathLocationDetecter {
    return initLocationDetecter(currentURL, detectPathname)
}

export function markSecureScriptPath(path: string): SecureScriptPath {
    return path as SecureScriptPath
}
