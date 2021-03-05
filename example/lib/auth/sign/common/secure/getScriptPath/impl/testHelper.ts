import { initLocationDetecter } from "../../../../../../z_vendor/getto-application/location/testHelper"

import { detectPathname } from "./core"

import { GetScriptPathLocationDetecter } from "../method"

import { ScriptPath } from "../data"

export function initGetScriptPathLocationDetecter(
    currentURL: URL,
): GetScriptPathLocationDetecter {
    return initLocationDetecter(currentURL, detectPathname)
}

export function markScriptPath(path: string): ScriptPath {
    return path as ScriptPath
}
