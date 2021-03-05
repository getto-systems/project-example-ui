import { newLocationDetecter } from "../../../../z_vendor/getto-application/location/init"

import { detectAuthSignViewType } from "./impl"

import { AuthSignViewLocationDetecter } from "./entryPoint"

import { authSignSearchParams } from "../../../../auth/sign/common/searchParams/data"

export function newAuthSignViewLocationDetecter(
    currentLocation: Location,
): AuthSignViewLocationDetecter {
    return newLocationDetecter(currentLocation, detectAuthSignViewType(authSignSearchParams))
}
