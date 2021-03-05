import { env } from "../../y_environment/env"

import { newLocationDetecter } from "../../z_vendor/getto-application/location/init"

import { detectContentPath } from "./impl/core"

import { LoadContentLocationDetecter } from "./action"

export function newLoadContentLocationDetecter(
    currentLocation: Location,
): LoadContentLocationDetecter {
    return newLocationDetecter(currentLocation, detectContentPath({ version: env.version }))
}
