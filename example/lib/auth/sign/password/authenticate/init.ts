import { newAuthenticateRemote } from "./infra/remote/authenticate"
import { newClock } from "../../../../z_vendor/getto-application/infra/clock/init"

import { delaySecond } from "../../../../z_vendor/getto-application/infra/config/infra"

import { AuthenticateInfra } from "./infra"

export function newAuthenticateInfra(): AuthenticateInfra {
    return {
        authenticate: newAuthenticateRemote(),
        clock: newClock(),
        config: {
            delay: delaySecond(1),
        },
    }
}
