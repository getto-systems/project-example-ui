import { env } from "../../../y_environment/env"

import { newLocationDetecter } from "../../../z_vendor/getto-application/location/init"

import { detectDocsContentPath } from "./core"

import { LoadDocsContentPathLocationDetecter } from "../method"

export function newLoadDocsContentPathLocationDetecter(
    currentLocation: Location,
): LoadDocsContentPathLocationDetecter {
    return newLocationDetecter(currentLocation, detectDocsContentPath({ version: env.version }))
}
