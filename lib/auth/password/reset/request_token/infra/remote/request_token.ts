import { env } from "../../../../../../y_environment/env"

import { newApi_RequestResetToken } from "../../../../../../z_external/api/auth/password/reset/request_token"

import {
    remoteFeature,
    remoteInfraError,
    wrapRemote,
} from "../../../../../../z_vendor/getto-application/infra/remote/helper"

import { RemoteOutsideFeature } from "../../../../../../z_vendor/getto-application/infra/remote/infra"
import { RequestResetTokenRemotePod } from "../../infra"

export function newRequestResetTokenRemote(
    feature: RemoteOutsideFeature,
): RequestResetTokenRemotePod {
    return wrapRemote(
        newApi_RequestResetToken(remoteFeature(env.apiServerURL, feature)),
        remoteInfraError,
    )
}
