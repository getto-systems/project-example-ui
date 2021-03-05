import { initLocationDetecter } from "../../z_vendor/getto-application/location/testHelper"

import { detectContentPath } from "./impl/core"

import { LoadContentLocationDetecter } from "./action"

export function initLoadContentLocationDetecter(
    currentURL: URL,
    version: string,
): LoadContentLocationDetecter {
    return initLocationDetecter(currentURL, detectContentPath({ version }))
}
