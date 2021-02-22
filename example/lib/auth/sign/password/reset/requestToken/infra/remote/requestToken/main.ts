import { env } from "../../../../../../../../y_environment/env"

import { initApiAuthSignResetStartSession } from "../../../../../../../../z_external/api/auth/sign/reset/startSession"

import { initRequestPasswordResetTokenConnect } from "./connect"

import { RequestPasswordResetTokenRemote } from "../../../infra"

export function newRequestPasswordResetTokenRemote(): RequestPasswordResetTokenRemote {
    return initRequestPasswordResetTokenConnect(
        initApiAuthSignResetStartSession(env.apiServerURL)
    )
}
