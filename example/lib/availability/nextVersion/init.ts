import { env } from "../../y_environment/env"

import { newLocationDetecter } from "../../z_vendor/getto-application/location/init"

import { detectAppTarget } from "./impl/core"

import { FindLocationDetecter } from "./action"

export function newFindLocationDetecter(currentLocation: Location): FindLocationDetecter {
    return newLocationDetecter(currentLocation, detectAppTarget({ version: env.version }))
}
