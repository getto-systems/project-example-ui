import { initLocationDetecter } from "../../../z_vendor/getto-application/location/test_helper"

import { detectDocsContentPath } from "./core"

import { LoadDocsContentPathLocationDetecter } from "../method"

export function initLoadDocsContentPathLocationDetecter(
    currentURL: URL,
    version: string,
): LoadDocsContentPathLocationDetecter {
    return initLocationDetecter(currentURL, detectDocsContentPath({ version }))
}
