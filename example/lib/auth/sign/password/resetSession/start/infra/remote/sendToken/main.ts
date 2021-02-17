import { env } from "../../../../../../../../y_environment/env"

import { initApiAuthSignResetSendToken } from "../../../../../../../../z_external/api/auth/sign/reset/sendToken"

import { initSendPasswordResetSessionTokenConnect } from "./connect"

import { SendPasswordResetSessionTokenRemote } from "../../../infra"

export function newSendPasswordResetSessionTokenRemote(): SendPasswordResetSessionTokenRemote {
    return initSendPasswordResetSessionTokenConnect(
        initApiAuthSignResetSendToken(env.apiServerURL)
    )
}
