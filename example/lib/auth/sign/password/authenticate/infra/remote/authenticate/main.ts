import { env } from "../../../../../../../y_environment/env"

import { newApiAuthSignPasswordAuthenticate } from "../../../../../../../z_external/api/auth/sign/password/authenticate"

import { initAuthenticatePasswordConnectRemoteAccess } from "./connect"

import { AuthenticatePasswordRemoteAccess } from "../../../infra"

export function newAuthenticatePasswordRemoteAccess(): AuthenticatePasswordRemoteAccess {
    return initAuthenticatePasswordConnectRemoteAccess(
        newApiAuthSignPasswordAuthenticate(env.apiServerURL)
    )
}
