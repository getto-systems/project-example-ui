import { initLocationDetecter } from "../../z_vendor/getto-application/location/testHelper"

import { detectAppTarget } from "./impl/core"

import { FindLocationDetecter } from "./action"

export function initFindLocationDetecter(currentURL: URL, version: string): FindLocationDetecter {
    return initLocationDetecter(currentURL, detectAppTarget({ version }))
}
