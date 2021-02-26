import { env } from "../../../../../y_environment/env"

import { initApiAuthSignResetStartSession } from "../../../../../z_external/api/auth/sign/reset/startSession"

import { delayed } from "../../../../../z_vendor/getto-application/infra/delayed/core"
import { initRequestTokenConnect } from "./infra/remote/requestToken/connect"

import { delaySecond } from "../../../../../z_vendor/getto-application/infra/config/infra"
import { RequestTokenInfra } from "./infra"

export function newRequestTokenInfra(): RequestTokenInfra {
    return {
        request: initRequestTokenConnect(
            initApiAuthSignResetStartSession(env.apiServerURL),
        ),
        config: {
            delay: delaySecond(1),
        },
        delayed,
    }
}
