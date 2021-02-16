import { env } from "../../../../../../../../y_environment/env"

import { initApiAuthSignResetStartSession } from "../../../../../../../../z_external/api/auth/sign/reset/startSession"

import { initStartPasswordResetSessionConnectRemoteAccess } from "./connect"

import { StartPasswordResetSessionSessionRemoteAccess } from "../../../infra"

export function newStartPasswordResetSessionRemoteAccess(): StartPasswordResetSessionSessionRemoteAccess {
    return initStartPasswordResetSessionConnectRemoteAccess(
        initApiAuthSignResetStartSession(env.apiServerURL)
    )
}
