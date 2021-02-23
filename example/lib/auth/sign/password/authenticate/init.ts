import { env } from "../../../../y_environment/env"

import { newApiAuthSignPasswordAuthenticate } from "../../../../z_external/api/auth/sign/password/authenticate"

import { delayed } from "../../../../z_getto/infra/delayed/core"
import { initAuthenticateConnect } from "./infra/remote/authenticate/connect"

import { delaySecond } from "../../../../z_getto/infra/config/infra"
import { AuthenticateInfra } from "./infra"

export function newAuthenticateInfra(): AuthenticateInfra {
    return {
        authenticate: initAuthenticateConnect(
            newApiAuthSignPasswordAuthenticate(env.apiServerURL),
        ),
        delayed,
        config: {
            delay: delaySecond(1),
        },
    }
}
