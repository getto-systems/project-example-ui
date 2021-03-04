import { initLocationDetecter } from "../../../../../z_vendor/getto-application/location/testHelper"

import { detectResetToken } from "./impl"

import { ResetLocationDetecter } from "./method"

import { authSignSearchParams } from "../../../common/searchParams/data"

export function initResetLocationDetecter(currentURL: URL): ResetLocationDetecter {
    return initLocationDetecter(currentURL, detectResetToken(authSignSearchParams.password.reset))
}
