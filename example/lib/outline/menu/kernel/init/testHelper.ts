import { mockLocationDetecter } from "../../../../z_vendor/getto-application/location/mock"

import { detectMenuTargetPath } from "../impl/detecter"

import { LoadMenuLocationDetecter } from "../method"

export function initLoadMenuLocationDetecter(
    currentURL: URL,
    version: string,
): LoadMenuLocationDetecter {
    return mockLocationDetecter(currentURL, detectMenuTargetPath({ version }))
}
