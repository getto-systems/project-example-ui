import { newLocationDetecter } from "../../../../z_vendor/getto-application/location/init"

import { detectSignViewType } from "./core"

import { SignViewLocationDetecter } from "../view"

export function newSignViewLocationDetecter(currentLocation: Location): SignViewLocationDetecter {
    return newLocationDetecter(currentLocation, detectSignViewType)
}
