import { env } from "../../../../../../y_environment/env"

import { newApi_ResetPassword } from "../../../../../../z_external/api/auth/password/reset/reset"

import {
    remoteFeature,
    remoteInfraError,
    wrapRemote,
} from "../../../../../../z_vendor/getto-application/infra/remote/helper"

import { RemoteOutsideFeature } from "../../../../../../z_vendor/getto-application/infra/remote/infra"
import { ResetPasswordRemotePod } from "../../infra"

export function newResetPasswordRemote(feature: RemoteOutsideFeature): ResetPasswordRemotePod {
    return wrapRemote(
        newApi_ResetPassword(remoteFeature(env.apiServerURL, feature)),
        remoteInfraError,
    )
}
