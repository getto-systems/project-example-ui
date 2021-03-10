import { mockLocationDetecter } from "../../../../../../z_vendor/getto-application/location/mock"

import { detectSessionID } from "./core"

import { CheckResetTokenSendingStatusLocationDetecter } from "../method"

import { signLinkParams } from "../../../../common/link/data"

export function initCheckResetTokenSendingStatusLocationDetecter(
    currentURL: URL,
): CheckResetTokenSendingStatusLocationDetecter {
    return mockLocationDetecter(currentURL, detectSessionID(signLinkParams.password.reset))
}
