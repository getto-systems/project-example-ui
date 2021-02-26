import { env } from "../../../../y_environment/env"

import { newApiAuthSignPasswordAuthenticate } from "../../../../z_external/api/auth/sign/password/authenticate"

import { delayedChecker } from "../../../../z_vendor/getto-application/infra/timer/impl"
import { initAuthenticateConnect } from "./infra/remote/authenticate/connect"

import { delaySecond } from "../../../../z_vendor/getto-application/infra/config/infra"
import { AuthenticateInfra } from "./infra"

export function newAuthenticateInfra(): AuthenticateInfra {
    return {
        authenticate: initAuthenticateConnect(
            newApiAuthSignPasswordAuthenticate(env.apiServerURL),
        ),
        delayed: delayedChecker,
        config: {
            delay: delaySecond(1),
        },
    }
}
