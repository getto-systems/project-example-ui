import { initLocationDetecter } from "../../../../z_vendor/getto-application/location/test_helper"

import { detectSignViewType } from "./core"

import { SignViewLocationDetecter } from "../view"

import { signLinkParams } from "../../common/link/data"

export function initSignViewLocationDetecter(currentURL: URL): SignViewLocationDetecter {
    return initLocationDetecter(currentURL, detectSignViewType(signLinkParams))
}
