import { detectResetToken } from "../../../sign/password/reset/register/impl"

import { LoginLocationInfo } from "./locationInfo"

export function initLoginLocationInfo(currentURL: URL): LoginLocationInfo {
    return {
        getResetToken: () => detectResetToken(currentURL),
    }
}
