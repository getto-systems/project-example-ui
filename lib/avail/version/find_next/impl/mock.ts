import { mockLocationDetecter } from "../../../../z_vendor/getto-application/location/mock"

import { detectApplicationTargetPath } from "./core"

import { FindNextVersionLocationDetecter } from "../method"

export function mockFindNextVersionLocationDetecter(
    currentURL: URL,
    version: string,
): FindNextVersionLocationDetecter {
    return mockLocationDetecter(currentURL, detectApplicationTargetPath({ version }))
}
