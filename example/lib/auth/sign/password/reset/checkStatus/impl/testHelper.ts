import { initLocationDetecter } from "../../../../../../z_vendor/getto-application/location/testHelper"

import { detectSessionID } from "./core"

import { CheckResetTokenSendingStatusLocationDetecter } from "../method"

import { signLinkParams } from "../../../../common/link/data"

export function initCheckResetTokenSendingStatusLocationDetecter(
    currentURL: URL,
): CheckResetTokenSendingStatusLocationDetecter {
    return initLocationDetecter(currentURL, detectSessionID(signLinkParams.password.reset))
}
