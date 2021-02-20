import { newAuthenticatePasswordRemote } from "./infra/remote/authenticate/main"

import { delayed } from "../../../../z_getto/infra/delayed/core"

import { delaySecond } from "../../../../z_getto/infra/config/infra"
import { AuthenticatePasswordInfra } from "./infra"

export function newAuthenticatePasswordInfra(): AuthenticatePasswordInfra {
    return {
        login: newAuthenticatePasswordRemote(),
        delayed,
        config: {
            delay: delaySecond(1),
        },
    }
}
