import { initLocationDetecter } from "../../../../z_vendor/getto-application/location/test_helper"

import { detectApplicationTargetPath } from "./core"

import { FindNextVersionLocationDetecter } from "../method"

import { ApplicationTargetPath } from "../data"

export function initFindNextVersionLocationDetecter(
    currentURL: URL,
    version: string,
): FindNextVersionLocationDetecter {
    return initLocationDetecter(currentURL, detectApplicationTargetPath({ version }))
}

export function markApplicationTargetPath(path: string): ApplicationTargetPath {
    return path as ApplicationTargetPath
}
