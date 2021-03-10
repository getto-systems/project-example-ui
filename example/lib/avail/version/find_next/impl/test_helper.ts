import { mockLocationDetecter } from "../../../../z_vendor/getto-application/location/mock"

import { detectApplicationTargetPath } from "./core"

import { FindNextVersionLocationDetecter } from "../method"

import { ApplicationTargetPath } from "../data"

export function initFindNextVersionLocationDetecter(
    currentURL: URL,
    version: string,
): FindNextVersionLocationDetecter {
    return mockLocationDetecter(currentURL, detectApplicationTargetPath({ version }))
}

export function markApplicationTargetPath(path: string): ApplicationTargetPath {
    return path as ApplicationTargetPath
}
