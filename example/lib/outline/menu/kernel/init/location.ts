import { env } from "../../../../y_environment/env"

import { newLocationDetecter } from "../../../../z_vendor/getto-application/location/init"

import { detectMenuTargetPath } from "../impl/detecter"

import { LoadMenuLocationDetecter } from "../method"

export function newLoadMenuLocationDetecter(currentLocation: Location): LoadMenuLocationDetecter {
    return newLocationDetecter(currentLocation, detectMenuTargetPath({ version: env.version }))
}
