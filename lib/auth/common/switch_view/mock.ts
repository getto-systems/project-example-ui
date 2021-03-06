import { mockLocationDetecter } from "../../../z_vendor/getto-application/location/mock"

import { detectSignViewType } from "./core"

import { SignViewLocationDetecter } from "./data"

export function mockSignViewLocationDetecter(currentURL: URL): SignViewLocationDetecter {
    return mockLocationDetecter(currentURL, detectSignViewType)
}
