import { detectPagePathname } from "../../../../common/application/impl/location"
import { detectResetToken } from "../../../../profile/passwordReset/impl/location"

import { LoginLocationInfo } from "../location"

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
