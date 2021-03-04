import { initLocationDetecter } from "../../../../z_vendor/getto-application/location/testHelper"

import { detectMenuTarget } from "./impl"

import { LoadOutlineMenuLocationDetecter } from "./action"

export function initLoadOutlineMenuLocationDetecter(
    currentURL: URL,
    version: string,
): LoadOutlineMenuLocationDetecter {
    return initLocationDetecter(currentURL, detectMenuTarget({ version }))
}
