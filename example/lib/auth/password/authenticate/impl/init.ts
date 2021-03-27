import { newAuthenticatePasswordRemote } from "../infra/remote/authenticate"
import { newClock } from "../../../../z_vendor/getto-application/infra/clock/init"

import { delaySecond } from "../../../../z_vendor/getto-application/infra/config/infra"

import { AuthenticatePasswordInfra } from "../infra"

export function newAuthenticatePasswordInfra(webCrypto: Crypto): AuthenticatePasswordInfra {
    return {
        authenticate: newAuthenticatePasswordRemote(webCrypto),
        clock: newClock(),
        config: {
            takeLongtimeThreshold: delaySecond(1),
        },
    }
}
