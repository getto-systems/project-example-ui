import { env } from "../../../../../../y_environment/env"

import { newApi_RequestResetToken } from "../../../../../../z_external/api/auth/password/reset/request_token"

import {
    remoteFeature,
    remoteInfraError,
    wrapRemote,
} from "../../../../../../z_vendor/getto-application/infra/remote/helper"

import { RequestResetTokenRemotePod } from "../../infra"

export function newRequestResetTokenRemote(webCrypto: Crypto): RequestResetTokenRemotePod {
    return wrapRemote(
        newApi_RequestResetToken(remoteFeature(env.apiServerURL, webCrypto)),
        remoteInfraError,
    )
}
