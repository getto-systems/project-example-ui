import { newResetPasswordRemote } from "../infra/remote/reset"
import { newClock } from "../../../../../z_vendor/getto-application/infra/clock/init"
import { newLocationDetecter } from "../../../../../z_vendor/getto-application/location/init"

import { detectResetToken } from "./core"

import { delaySecond } from "../../../../../z_vendor/getto-application/infra/config/infra"
import { ResetPasswordInfra } from "../infra"

import { ResetPasswordLocationDetecter } from "../method"

export function newResetPasswordLocationDetecter(
    currentLocation: Location,
): ResetPasswordLocationDetecter {
    return newLocationDetecter(currentLocation, detectResetToken)
}

export function newResetPasswordInfra(webCrypto: Crypto): ResetPasswordInfra {
    return {
        reset: newResetPasswordRemote(webCrypto),
        clock: newClock(),
        config: {
            takeLongtimeThreshold: delaySecond(1),
        },
    }
}
