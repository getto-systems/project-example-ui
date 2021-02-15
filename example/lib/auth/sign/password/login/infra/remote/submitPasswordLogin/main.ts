import { env } from "../../../../../../../y_environment/env"

import { initApiAuthSignLogin } from "../../../../../../../z_external/api/auth/sign/login"

import { initSubmitPasswordLoginConnectRemoteAccess } from "./connect"

import { SubmitPasswordLoginRemoteAccess } from "../../../infra"

export function newSubmitPasswordLoginRemoteAccess(): SubmitPasswordLoginRemoteAccess {
    return initSubmitPasswordLoginConnectRemoteAccess(initApiAuthSignLogin(env.apiServerURL))
}
