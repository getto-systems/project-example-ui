import { env } from "../../../../../../../y_environment/env"

import { newApiAuthSignPasswordAuthenticate } from "../../../../../../../z_external/api/auth/sign/password/authenticate"

import { initAuthenticatePasswordConnect } from "./connect"

import { AuthenticatePasswordRemote } from "../../../infra"

export function newAuthenticatePasswordRemote(): AuthenticatePasswordRemote {
    return initAuthenticatePasswordConnect(
        newApiAuthSignPasswordAuthenticate(env.apiServerURL)
    )
}
