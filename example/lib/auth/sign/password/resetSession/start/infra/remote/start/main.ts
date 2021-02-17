import { env } from "../../../../../../../../y_environment/env"

import { initApiAuthSignResetStartSession } from "../../../../../../../../z_external/api/auth/sign/reset/startSession"

import { initStartPasswordResetSessionConnect } from "./connect"

import { StartPasswordResetSessionSessionRemote } from "../../../infra"

export function newStartPasswordResetSessionRemote(): StartPasswordResetSessionSessionRemote {
    return initStartPasswordResetSessionConnect(
        initApiAuthSignResetStartSession(env.apiServerURL)
    )
}
