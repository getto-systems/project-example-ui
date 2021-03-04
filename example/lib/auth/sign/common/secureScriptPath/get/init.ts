import { newLocationDetecter } from "../../../../../z_vendor/getto-application/location/init"

import { detectPathname } from "./impl"

import { GetSecureScriptPathLocationDetecter } from "./method"

export function newSecureScriptPathLocationDetecter(
    currentLocation: Location,
): GetSecureScriptPathLocationDetecter {
    return newLocationDetecter(currentLocation, detectPathname)
}
