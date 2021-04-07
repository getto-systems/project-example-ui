import { LocationOutsideFeature } from "../../../z_vendor/getto-application/location/infra"
import { newLocationDetecter } from "../../../z_vendor/getto-application/location/init"

import { detectSignViewType } from "./core"

import { SignViewLocationDetecter } from "./data"

export function newSignViewLocationDetecter(
    feature: LocationOutsideFeature,
): SignViewLocationDetecter {
    return newLocationDetecter(feature, detectSignViewType)
}
