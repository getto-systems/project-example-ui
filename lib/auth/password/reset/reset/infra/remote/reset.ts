import { env } from "../../../../../../y_environment/env"

import { newApi_ResetPassword } from "../../../../../../z_external/api/auth/password/reset/reset"

import {
    remoteFeature,
    remoteInfraError,
    wrapRemote,
} from "../../../../../../z_vendor/getto-application/infra/remote/helper"

import { ResetPasswordRemotePod } from "../../infra"

export function newResetPasswordRemote(webCrypto: Crypto): ResetPasswordRemotePod {
    return wrapRemote(
        newApi_ResetPassword(remoteFeature(env.apiServerURL, webCrypto)),
        remoteInfraError,
    )
}
