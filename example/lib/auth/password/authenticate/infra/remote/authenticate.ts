import { env } from "../../../../../y_environment/env"

import { newApi_AuthenticatePassword } from "../../../../../z_external/api/auth/password/authenticate"

import {
    remoteFeature,
    remoteInfraError,
    wrapRemote,
} from "../../../../../z_vendor/getto-application/infra/remote/helper"

import { AuthenticatePasswordRemotePod } from "../../infra"

export function newAuthenticatePasswordRemote(webCrypto: Crypto): AuthenticatePasswordRemotePod {
    return wrapRemote(
        newApi_AuthenticatePassword(remoteFeature(env.apiServerURL, webCrypto)),
        remoteInfraError,
    )
}
