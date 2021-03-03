import { newResetPasswordRemote } from "./infra/remote/reset"
import { newClock } from "../../../../../z_vendor/getto-application/infra/clock/init"

import { initResetLocationInfo } from "./impl"

import { delaySecond } from "../../../../../z_vendor/getto-application/infra/config/infra"
import { ResetInfra } from "./infra"

import { ResetLocationInfo } from "./method"

export function newResetLocationInfo(currentLocation: Location): ResetLocationInfo {
    return initResetLocationInfo(new URL(currentLocation.toString()))
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
