import { mockLocationDetecter } from "../../../../../../z_vendor/getto-application/location/mock"

import { detectResetToken } from "./core"

import { ResetPasswordLocationDetecter } from "../method"

import { signLinkParams } from "../../../../common/link/data"

export function initResetPasswordLocationDetecter(currentURL: URL): ResetPasswordLocationDetecter {
    return mockLocationDetecter(currentURL, detectResetToken(signLinkParams.password.reset))
}
