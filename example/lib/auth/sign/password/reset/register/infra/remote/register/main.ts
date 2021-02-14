import { initApiAuthSignResetRegister } from "../../../../../../../../z_external/api/auth/sign/reset/register"

import { env } from "../../../../../../../../y_environment/env"

import { initRegisterConnectRemoteAccess } from "./connect"

import { RegisterRemoteAccess } from "../../../infra"

export function newRegisterRemoteAccess(): RegisterRemoteAccess {
    return initRegisterConnectRemoteAccess(initApiAuthSignResetRegister(env.apiServerURL))
}
