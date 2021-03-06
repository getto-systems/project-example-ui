import { mockLocationDetecter } from "../../../../../z_vendor/getto-application/location/mock"

import { detectSessionID } from "./core"

import { CheckResetTokenSendingStatusLocationDetecter } from "../method"

export function mockCheckResetTokenSendingStatusLocationDetecter(
    currentURL: URL,
): CheckResetTokenSendingStatusLocationDetecter {
    return mockLocationDetecter(currentURL, detectSessionID)
}
