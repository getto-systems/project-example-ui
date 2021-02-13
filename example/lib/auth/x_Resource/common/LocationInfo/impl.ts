import { detectPagePathname } from "../../../sign/location/impl/location"
import { detectResetToken } from "../../../sign/passwordReset/impl/location"

import { LoginLocationInfo } from "./locationInfo"

export function initLoginLocationInfo(currentURL: URL): LoginLocationInfo {
    return {
        application: {
            getPagePathname: () => detectPagePathname(currentURL),
        },
        reset: {
            getResetToken: () => detectResetToken(currentURL),
        },
    }
}
