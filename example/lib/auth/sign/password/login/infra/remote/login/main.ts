import { env } from "../../../../../../../y_environment/env"

import { initApiAuthLogin } from "../../../../../../../z_external/api/auth/login"

import { initLoginConnectRemoteAccess } from "./connect"

import { LoginRemoteAccess } from "../../../infra"

export function newLoginRemoteAccess(): LoginRemoteAccess {
    return initLoginConnectRemoteAccess(initApiAuthLogin(env.apiServerURL))
}
