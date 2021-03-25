import { env } from "../../../../../y_environment/env"

import { newApi_AuthenticatePassword } from "../../../../../z_external/api/auth/password/authenticate"

import {
    remoteInfraError,
    wrapRemote,
} from "../../../../../z_vendor/getto-application/infra/remote/helper"

import { AuthenticatePasswordRemotePod } from "../../infra"

export function newAuthenticatePasswordRemote(): AuthenticatePasswordRemotePod {
    return wrapRemote(newApi_AuthenticatePassword(env.apiServerURL), remoteInfraError)
}
