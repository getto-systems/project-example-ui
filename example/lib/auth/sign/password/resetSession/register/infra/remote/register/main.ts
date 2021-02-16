import { initApiAuthSignResetRegister } from "../../../../../../../../z_external/api/auth/sign/reset/register"

import { env } from "../../../../../../../../y_environment/env"

import { initRegisterPasswordResetSessionConnectRemoteAccess } from "./connect"

import { RegisterPasswordResetSessionRemoteAccess } from "../../../infra"

export function newRegisterPasswordResetSessionRemoteAccess(): RegisterPasswordResetSessionRemoteAccess {
    return initRegisterPasswordResetSessionConnectRemoteAccess(
        initApiAuthSignResetRegister(env.apiServerURL)
    )
}
