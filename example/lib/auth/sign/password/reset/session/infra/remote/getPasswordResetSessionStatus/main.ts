import { env } from "../../../../../../../../y_environment/env"

import { initApiAuthSignResetGetStatus } from "../../../../../../../../z_external/api/auth/sign/reset/getStatus"

import { initGetPasswordResetSessionStatusConnectRemoteAccess } from "./connect"

import { GetPasswordResetSessionStatusRemoteAccess } from "../../../infra"

export function newGetPasswordResetSessionStatusRemoteAccess(): GetPasswordResetSessionStatusRemoteAccess {
    return initGetPasswordResetSessionStatusConnectRemoteAccess(
        initApiAuthSignResetGetStatus(env.apiServerURL)
    )
}
