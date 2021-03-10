import { mockLocationDetecter } from "../../../../z_vendor/getto-application/location/mock"

import { detectSignViewType } from "./core"

import { SignViewLocationDetecter } from "../view"

import { signLinkParams } from "../../common/link/data"

export function initSignViewLocationDetecter(currentURL: URL): SignViewLocationDetecter {
    return mockLocationDetecter(currentURL, detectSignViewType(signLinkParams))
}
