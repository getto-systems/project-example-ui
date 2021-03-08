import { initLocationDetecter } from "../../../../../../z_vendor/getto-application/location/test_helper"

import { detectResetToken } from "./core"

import { ResetPasswordLocationDetecter } from "../method"

import { signLinkParams } from "../../../../common/link/data"

export function initResetPasswordLocationDetecter(currentURL: URL): ResetPasswordLocationDetecter {
    return initLocationDetecter(currentURL, detectResetToken(signLinkParams.password.reset))
}