import { newResetPasswordRemote } from "./infra/remote/reset"
import { newClock } from "../../../../../z_vendor/getto-application/infra/clock/init"
import { newLocationDetecter } from "../../../../../z_vendor/getto-application/location/init"

import { detectResetToken } from "./impl"

import { delaySecond } from "../../../../../z_vendor/getto-application/infra/config/infra"
import { ResetInfra } from "./infra"

import { ResetLocationDetecter } from "./method"

import { signLinkParams } from "../../../common/link/data"

export function newResetLocationDetecter(currentLocation: Location): ResetLocationDetecter {
    return newLocationDetecter(
        currentLocation,
        detectResetToken(signLinkParams.password.reset),
    )
}

export function newResetInfra(): ResetInfra {
    return {
        reset: newResetPasswordRemote(),
        clock: newClock(),
        config: {
            delay: delaySecond(1),
        },
    }
}
