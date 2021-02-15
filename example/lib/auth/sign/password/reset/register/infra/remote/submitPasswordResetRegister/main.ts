import { initApiAuthSignResetRegister } from "../../../../../../../../z_external/api/auth/sign/reset/register"

import { env } from "../../../../../../../../y_environment/env"

import { initSubmitPasswordResetRegisterConnectRemoteAccess } from "./connect"

import { SubmitPasswordResetRegisterRemoteAccess } from "../../../infra"

export function newSubmitPasswordResetRegisterRemoteAccess(): SubmitPasswordResetRegisterRemoteAccess {
    return initSubmitPasswordResetRegisterConnectRemoteAccess(
        initApiAuthSignResetRegister(env.apiServerURL)
    )
}
