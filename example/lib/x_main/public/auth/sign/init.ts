import { newLocationDetecter } from "../../../../z_vendor/getto-application/location/init"

import { detectAuthSignViewType } from "./impl"

import { AuthSignViewLocationDetecter } from "./entryPoint"

import { authSignLinkParams } from "../../../../auth/sign/common/link/data"

export function newAuthSignViewLocationDetecter(
    currentLocation: Location,
): AuthSignViewLocationDetecter {
    return newLocationDetecter(currentLocation, detectAuthSignViewType(authSignLinkParams))
}
