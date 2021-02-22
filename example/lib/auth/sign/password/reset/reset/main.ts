import { newResetPasswordRemote } from "./infra/remote/reset/main"

import { delayed } from "../../../../../z_getto/infra/delayed/core"

import { delaySecond } from "../../../../../z_getto/infra/config/infra"
import { ResetPasswordInfra } from "./infra"

export function newResetPasswordInfra(): ResetPasswordInfra {
    return {
        reset: newResetPasswordRemote(),
        delayed: delayed,
        config: {
            delay: delaySecond(1),
        },
    }
}
