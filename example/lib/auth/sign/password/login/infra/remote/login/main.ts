import { env } from "../../../../../../../y_environment/env"

import { initApiAuthSignLogin } from "../../../../../../../z_external/api/auth/sign/login"

import { initLoginConnectRemoteAccess } from "./connect"

import { LoginRemoteAccess } from "../../../infra"

export function newLoginRemoteAccess(): LoginRemoteAccess {
    return initLoginConnectRemoteAccess(initApiAuthSignLogin(env.apiServerURL))
}
