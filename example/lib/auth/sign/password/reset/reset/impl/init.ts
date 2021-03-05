import { newResetPasswordRemote } from "../infra/remote/reset"
import { newClock } from "../../../../../../z_vendor/getto-application/infra/clock/init"
import { newLocationDetecter } from "../../../../../../z_vendor/getto-application/location/init"

import { detectResetToken } from "./core"

import { delaySecond } from "../../../../../../z_vendor/getto-application/infra/config/infra"
import { ResetPasswordInfra } from "../infra"

import { ResetPasswordLocationDetecter } from "../method"

import { signLinkParams } from "../../../../common/link/data"

export function newResetPasswordLocationDetecter(
    currentLocation: Location,
): ResetPasswordLocationDetecter {
    return newLocationDetecter(currentLocation, detectResetToken(signLinkParams.password.reset))
}

export function newResetPasswordInfra(): ResetPasswordInfra {
    return {
        reset: newResetPasswordRemote(),
        clock: newClock(),
        config: {
            delay: delaySecond(1),
        },
    }
}
