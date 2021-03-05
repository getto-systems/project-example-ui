import { initLocationDetecter } from "../../../../../z_vendor/getto-application/location/testHelper"

import { detectResetToken } from "./impl"

import { ResetLocationDetecter } from "./method"

import { authSignLinkParams } from "../../../common/link/data"

export function initResetLocationDetecter(currentURL: URL): ResetLocationDetecter {
    return initLocationDetecter(currentURL, detectResetToken(authSignLinkParams.password.reset))
}
