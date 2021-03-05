import { newLocationDetecter } from "../../../../z_vendor/getto-application/location/init"

import { detectSignViewType } from "./core"

import { SignViewLocationDetecter } from "../view"

import { signLinkParams } from "../../common/link/data"

export function newSignViewLocationDetecter(
    currentLocation: Location,
): SignViewLocationDetecter {
    return newLocationDetecter(currentLocation, detectSignViewType(signLinkParams))
}
