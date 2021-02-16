import { newAuthenticatePasswordRemoteAccess } from "./infra/remote/authenticate/main"

import { delayed } from "../../../../z_infra/delayed/core"

import { delaySecond } from "../../../../z_infra/time/infra"
import { AuthenticatePasswordInfra } from "./infra"

export function newAuthenticatePasswordInfra(): AuthenticatePasswordInfra {
    return {
        login: newAuthenticatePasswordRemoteAccess(),
        delayed,
        config: {
            delay: delaySecond(1),
        },
    }
}
