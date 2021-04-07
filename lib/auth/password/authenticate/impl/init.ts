import { newAuthenticatePasswordRemote } from "../infra/remote/authenticate"
import { newClock } from "../../../../z_vendor/getto-application/infra/clock/init"

import { delaySecond } from "../../../../z_vendor/getto-application/infra/config/infra"

import { AuthenticatePasswordInfra } from "../infra"
import { RemoteOutsideFeature } from "../../../../z_vendor/getto-application/infra/remote/infra"

export function newAuthenticatePasswordInfra(
    feature: RemoteOutsideFeature,
): AuthenticatePasswordInfra {
    return {
        authenticate: newAuthenticatePasswordRemote(feature),
        clock: newClock(),
        config: {
            takeLongtimeThreshold: delaySecond(1),
        },
    }
}
