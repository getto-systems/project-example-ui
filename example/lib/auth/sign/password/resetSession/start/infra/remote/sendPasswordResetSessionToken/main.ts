import { env } from "../../../../../../../../y_environment/env"

import { initApiAuthSignResetSendToken } from "../../../../../../../../z_external/api/auth/sign/reset/sendToken"

import { initSendPasswordResetSessionTokenConnectRemoteAccess } from "./connect"

import { SendPasswordResetSessionTokenRemoteAccess } from "../../../infra"

export function newSendPasswordResetSessionTokenRemoteAccess(): SendPasswordResetSessionTokenRemoteAccess {
    return initSendPasswordResetSessionTokenConnectRemoteAccess(
        initApiAuthSignResetSendToken(env.apiServerURL)
    )
}
