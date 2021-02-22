import { newRegisterPasswordRemote } from "./infra/remote/register/main"

import { delayed } from "../../../../../z_getto/infra/delayed/core"

import { delaySecond } from "../../../../../z_getto/infra/config/infra"
import { RegisterPasswordInfra } from "./infra"

export function newRegisterPasswordInfra(): RegisterPasswordInfra {
    return {
        register: newRegisterPasswordRemote(),
        delayed: delayed,
        config: {
            delay: delaySecond(1),
        },
    }
}
