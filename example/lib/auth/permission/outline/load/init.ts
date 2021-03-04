import { env } from "../../../../y_environment/env"

import { newLocationDetecter } from "../../../../z_vendor/getto-application/location/init"

import { detectMenuTarget } from "./impl"

import { LoadOutlineMenuLocationDetecter } from "./action"

export function newLoadOutlineMenuLocationDetecter(
    currentLocation: Location,
): LoadOutlineMenuLocationDetecter {
    return newLocationDetecter(currentLocation, detectMenuTarget({ version: env.version }))
}
